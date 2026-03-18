/*
 * 3D Model Inspector — glTF Vertex Data Extraction Service
 *
 * "Upload your glTF model and we'll extract the vertex data for you!"
 *
 * Powered by cgltf v1.15
 */

#define CGLTF_IMPLEMENTATION
#include "cgltf.h"

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <unistd.h>
#include <signal.h>
#include <sys/socket.h>
#include <netinet/in.h>

#define PORT 31337
#define MAX_JSON_SIZE (64 * 1024)
#define MAX_VERTICES 4096

static void alarm_handler(int sig) { (void)sig; _exit(0); }

/* ─── Banner ─── */
static void send_banner(int fd)
{
    const char *banner =
        "\n"
        "  ╔═══════════════════════════════════════════╗\n"
        "  ║     3D Model Inspector v1.0               ║\n"
        "  ║     glTF Vertex Data Extraction Service    ║\n"
        "  ╚═══════════════════════════════════════════╝\n"
        "\n"
        "  Upload your glTF JSON and we'll extract\n"
        "  the vertex positions for you!\n"
        "\n"
        "  Protocol:\n"
        "    1. Send JSON size as 4-byte LE integer\n"
        "    2. Send glTF JSON data\n"
        "    3. Receive extracted vertex float data\n"
        "\n";
    write(fd, banner, strlen(banner));
}

/* ─── Core: Extract vertex data from glTF ─── */
static void handle_client(int fd)
{
    alarm(30);

    send_banner(fd);

    char *flag = NULL;

    /* Read JSON size */
    uint32_t json_size;
    if (read(fd, &json_size, 4) != 4) goto cleanup;
    if (json_size == 0 || json_size > MAX_JSON_SIZE) {
        const char *err = "[-] Invalid size\n";
        write(fd, err, strlen(err));
        goto cleanup;
    }

    /* Read JSON data */
    uint8_t *json = malloc(json_size + 1);
    uint32_t total = 0;
    while (total < json_size) {
        ssize_t n = read(fd, json + total, json_size - total);
        if (n <= 0) { free(json); goto cleanup; }
        total += n;
    }
    json[json_size] = 0;

    /* Parse glTF */
    cgltf_options options = {0};
    cgltf_data *data = NULL;

    if (cgltf_parse(&options, json, json_size, &data) != cgltf_result_success) {
        const char *err = "[-] Parse error: invalid glTF JSON\n";
        write(fd, err, strlen(err));
        free(json);
        goto cleanup;
    }

    /* Load buffers (data URIs) */
    if (cgltf_load_buffers(&options, data, NULL) != cgltf_result_success) {
        const char *err = "[-] Buffer load error\n";
        write(fd, err, strlen(err));
        cgltf_free(data);
        free(json);
        goto cleanup;
    }

    /*
     * FLAG는 요청 처리 중 힙에 로드됨
     * (실제 서비스에서는 DB 쿼리 결과, 세션 토큰 등이 이 위치에 있을 수 있음)
     * cgltf_load_buffers() 이후에 할당되므로 buffer 뒤 힙 영역에 위치
     */
    {
        FILE *f = fopen("flag.txt", "r");
        if (!f) {
            const char *err = "[-] Service misconfigured\n";
            write(fd, err, strlen(err));
            cgltf_free(data);
            free(json);
            return;
        }
        flag = malloc(128);
        memset(flag, 0, 128);
        fread(flag, 1, 127, f);
        fclose(f);
        char *nl = strchr(flag, '\n');
        if (nl) *nl = 0;
    }

    /* Check: must have at least one accessor */
    if (data->accessors_count == 0) {
        const char *err = "[-] No accessors found in model\n";
        write(fd, err, strlen(err));
        cgltf_free(data);
        free(json);
        goto cleanup;
    }

    /* Validate (서버가 "보안을 위해" validate를 호출하지만, 이 버그는 우회됨) */
    cgltf_validate(data);

    cgltf_accessor *acc = &data->accessors[0];
    cgltf_size num_components = cgltf_num_components(acc->type);

    if (num_components == 0 || num_components > 16) {
        const char *err = "[-] Invalid accessor type\n";
        write(fd, err, strlen(err));
        cgltf_free(data);
        free(json);
        goto cleanup;
    }

    /* Limit vertex count (서버는 MAX_VERTICES까지만 허용한다고 "생각"하지만...) */
    cgltf_size count = acc->count;
    if (count > MAX_VERTICES) {
        count = MAX_VERTICES;  /* "안전한" 제한... 하지만 OOB는 이미 발생 */
    }

    /* Send header: [4 bytes: total_floats] */
    uint32_t total_floats = (uint32_t)(count * num_components);
    write(fd, &total_floats, 4);

    /*
     * Extract vertex data — THE VULNERABILITY
     *
     * cgltf_accessor_read_float()는 accessor의 buffer_view 크기를
     * 검증하지 않고 offset + stride * index로 포인터를 계산함.
     * buffer가 작고 count가 크면 힙 너머를 읽음.
     */
    cgltf_float out[16];
    for (cgltf_size i = 0; i < count; i++) {
        cgltf_accessor_read_float(acc, i, out, num_components);
        write(fd, out, num_components * sizeof(cgltf_float));
    }

    char msg[128];
    snprintf(msg, sizeof(msg), "[+] Extracted %u vertices (%u floats)\n",
             (unsigned)(count), total_floats);
    write(fd, msg, strlen(msg));

    cgltf_free(data);
    free(json);

cleanup:
    free(flag);
}

int main(void)
{
    signal(SIGALRM, alarm_handler);
    signal(SIGCHLD, SIG_IGN);

    int sockfd = socket(AF_INET, SOCK_STREAM, 0);
    int opt = 1;
    setsockopt(sockfd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

    struct sockaddr_in addr = {
        .sin_family = AF_INET,
        .sin_port = htons(PORT),
        .sin_addr.s_addr = INADDR_ANY,
    };

    if (bind(sockfd, (struct sockaddr*)&addr, sizeof(addr)) < 0) {
        perror("bind");
        return 1;
    }

    listen(sockfd, 16);
    printf("[*] 3D Model Inspector listening on port %d\n", PORT);

    while (1) {
        struct sockaddr_in client;
        socklen_t len = sizeof(client);
        int clientfd = accept(sockfd, (struct sockaddr*)&client, &len);
        if (clientfd < 0) continue;

        pid_t pid = fork();
        if (pid == 0) {
            close(sockfd);
            dup2(clientfd, STDIN_FILENO);
            dup2(clientfd, STDOUT_FILENO);
            close(clientfd);
            handle_client(STDOUT_FILENO);
            _exit(0);
        }
        close(clientfd);
    }
}
