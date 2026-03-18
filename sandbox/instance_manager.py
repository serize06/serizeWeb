#!/usr/bin/env python3
"""
Challenge Instance Manager — Oracle VM에서 실행
Docker 컨테이너 기반 챌린지 인스턴스 생성/삭제 API
"""

import subprocess
import random
import time
import threading
import hashlib
import os
from flask import Flask, request, jsonify

app = Flask(__name__)

SECRET = os.environ.get("INSTANCE_SECRET", "ch4ng3-th1s-s3cr3t")
HOST_IP = os.environ.get("HOST_IP", "140.245.79.35")
INSTANCE_TIMEOUT = int(os.environ.get("INSTANCE_TIMEOUT", "1800"))  # 30분
MAX_INSTANCES = int(os.environ.get("MAX_INSTANCES", "20"))
PORT_MIN = 40000
PORT_MAX = 50000

# challenge_type → Docker image
CHALLENGE_IMAGES = {
    "cgltf-oob-read": "cgltf-challenge",
}

# 활성 인스턴스: {instance_id: {port, challenge_type, user_id, created_at, expires_at, container_name}}
instances = {}
lock = threading.Lock()


def verify_token(token):
    return token == SECRET


def cleanup_instance(instance_id):
    """타임아웃 후 인스턴스 자동 삭제"""
    time.sleep(INSTANCE_TIMEOUT)
    with lock:
        if instance_id in instances:
            info = instances[instance_id]
            subprocess.run(["sudo", "docker", "stop", info["container_name"]],
                         capture_output=True, timeout=10)
            subprocess.run(["sudo", "docker", "rm", "-f", info["container_name"]],
                         capture_output=True, timeout=10)
            del instances[instance_id]


def find_free_port():
    """사용되지 않는 랜덤 포트 찾기"""
    used = {info["port"] for info in instances.values()}
    for _ in range(100):
        port = random.randint(PORT_MIN, PORT_MAX)
        if port not in used:
            return port
    return None


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "instances": len(instances)})


@app.route("/create", methods=["POST"])
def create_instance():
    token = request.headers.get("X-Secret")
    if not verify_token(token):
        return jsonify({"error": "unauthorized"}), 401

    data = request.json or {}
    challenge_type = data.get("challenge_type")
    user_id = data.get("user_id", "anonymous")

    if challenge_type not in CHALLENGE_IMAGES:
        return jsonify({"error": f"unknown challenge: {challenge_type}"}), 400

    with lock:
        # 같은 유저가 같은 챌린지 중복 생성 방지
        for iid, info in instances.items():
            if info["user_id"] == user_id and info["challenge_type"] == challenge_type:
                remaining = int(info["expires_at"] - time.time())
                return jsonify({
                    "instance_id": iid,
                    "host": HOST_IP,
                    "port": info["port"],
                    "remaining": max(0, remaining),
                    "message": "existing instance"
                })

        if len(instances) >= MAX_INSTANCES:
            return jsonify({"error": "max instances reached"}), 503

        port = find_free_port()
        if not port:
            return jsonify({"error": "no free ports"}), 503

        instance_id = hashlib.sha256(
            f"{user_id}{challenge_type}{time.time()}{random.random()}".encode()
        ).hexdigest()[:12]
        container_name = f"inst-{challenge_type}-{instance_id}"
        image = CHALLENGE_IMAGES[challenge_type]

        # Docker run (host network로 FORWARD 체인 우회)
        result = subprocess.run([
            "sudo", "docker", "run", "-d",
            "--name", container_name,
            "--network", "host",
            "-e", f"PORT={port}",
            "--memory=256m",
            "--cpus=0.5",
            "--restart", "no",
            image
        ], capture_output=True, text=True, timeout=30)

        if result.returncode != 0:
            return jsonify({"error": "failed to start", "detail": result.stderr}), 500

        # iptables 허용
        subprocess.run([
            "sudo", "iptables", "-I", "INPUT", "-p", "tcp",
            "--dport", str(port), "-j", "ACCEPT"
        ], capture_output=True, timeout=5)
        subprocess.run([
            "sudo", "iptables", "-I", "FORWARD", "-p", "tcp",
            "--dport", str(port), "-j", "ACCEPT"
        ], capture_output=True, timeout=5)
        subprocess.run([
            "sudo", "iptables", "-I", "FORWARD", "-p", "tcp",
            "--sport", str(port), "-j", "ACCEPT"
        ], capture_output=True, timeout=5)

        now = time.time()
        instances[instance_id] = {
            "port": port,
            "challenge_type": challenge_type,
            "user_id": user_id,
            "created_at": now,
            "expires_at": now + INSTANCE_TIMEOUT,
            "container_name": container_name,
        }

    # 자동 삭제 스레드
    t = threading.Thread(target=cleanup_instance, args=(instance_id,), daemon=True)
    t.start()

    return jsonify({
        "instance_id": instance_id,
        "host": HOST_IP,
        "port": port,
        "remaining": INSTANCE_TIMEOUT,
        "message": "created"
    })


@app.route("/destroy", methods=["POST"])
def destroy_instance():
    token = request.headers.get("X-Secret")
    if not verify_token(token):
        return jsonify({"error": "unauthorized"}), 401

    data = request.json or {}
    instance_id = data.get("instance_id")

    with lock:
        if instance_id not in instances:
            return jsonify({"error": "not found"}), 404

        info = instances[instance_id]
        subprocess.run(["sudo", "docker", "stop", info["container_name"]],
                     capture_output=True, timeout=10)
        subprocess.run(["sudo", "docker", "rm", "-f", info["container_name"]],
                     capture_output=True, timeout=10)

        # iptables 정리
        port = info["port"]
        subprocess.run(["sudo", "iptables", "-D", "INPUT", "-p", "tcp",
                       "--dport", str(port), "-j", "ACCEPT"],
                     capture_output=True, timeout=5)
        subprocess.run(["sudo", "iptables", "-D", "FORWARD", "-p", "tcp",
                       "--dport", str(port), "-j", "ACCEPT"],
                     capture_output=True, timeout=5)
        subprocess.run(["sudo", "iptables", "-D", "FORWARD", "-p", "tcp",
                       "--sport", str(port), "-j", "ACCEPT"],
                     capture_output=True, timeout=5)

        del instances[instance_id]

    return jsonify({"message": "destroyed"})


@app.route("/status/<instance_id>", methods=["GET"])
def instance_status(instance_id):
    token = request.headers.get("X-Secret")
    if not verify_token(token):
        return jsonify({"error": "unauthorized"}), 401

    with lock:
        if instance_id not in instances:
            return jsonify({"error": "not found"}), 404
        info = instances[instance_id]
        remaining = int(info["expires_at"] - time.time())
        return jsonify({
            "instance_id": instance_id,
            "host": HOST_IP,
            "port": info["port"],
            "remaining": max(0, remaining),
            "challenge_type": info["challenge_type"],
        })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=31337)
