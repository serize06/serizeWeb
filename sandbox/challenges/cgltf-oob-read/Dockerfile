FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y gcc && \
    rm -rf /var/lib/apt/lists/*

RUN useradd -m ctf

WORKDIR /app
COPY server.c cgltf.h flag.txt ./

RUN gcc -o server server.c -O2 -no-pie -w && \
    chmod +x server && \
    chown ctf:ctf /app/server /app/flag.txt && \
    chmod 444 flag.txt

USER ctf

EXPOSE 31337
CMD ["./server"]
