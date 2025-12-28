import docker
import asyncio
import uuid
from datetime import datetime, timedelta
from typing import Dict, Optional
import logging

logger = logging.getLogger(__name__)


class SandboxManager:
    def __init__(self, max_containers: int = 10, timeout: int = 300):
        self.client = docker.from_env()
        self.max_containers = max_containers
        self.timeout = timeout  # seconds
        self.active_containers: Dict[str, dict] = {}
    
    async def create_sandbox(self, challenge_type: str, user_id: str) -> Optional[dict]:
        """격리된 취약점 데모 컨테이너 생성"""
        
        # 최대 컨테이너 수 체크
        if len(self.active_containers) >= self.max_containers:
            await self._cleanup_expired()
            if len(self.active_containers) >= self.max_containers:
                return None
        
        sandbox_id = str(uuid.uuid4())[:8]
        container_name = f"sandbox-{challenge_type}-{sandbox_id}"
        
        try:
            # 챌린지 타입에 따른 이미지 선택
            image_map = {
                "xss": "serize/xss-demo:latest",
                "sqli": "serize/sqli-demo:latest",
                "jwt": "serize/jwt-demo:latest",
                "prompt-injection": "serize/prompt-injection-demo:latest",
            }
            
            image = image_map.get(challenge_type)
            if not image:
                return None
            
            # 컨테이너 생성 (격리 설정)
            container = self.client.containers.run(
                image,
                name=container_name,
                detach=True,
                auto_remove=True,
                mem_limit="256m",
                cpu_period=100000,
                cpu_quota=50000,  # 50% CPU
                network_mode="bridge",
                read_only=False,
                security_opt=["no-new-privileges:true"],
                cap_drop=["ALL"],
            )
            
            # 포트 가져오기
            container.reload()
            ports = container.attrs['NetworkSettings']['Ports']
            
            sandbox_info = {
                "sandbox_id": sandbox_id,
                "container_id": container.id,
                "container_name": container_name,
                "challenge_type": challenge_type,
                "user_id": user_id,
                "created_at": datetime.utcnow(),
                "expires_at": datetime.utcnow() + timedelta(seconds=self.timeout),
                "ports": ports,
            }
            
            self.active_containers[sandbox_id] = sandbox_info
            
            # 자동 정리 스케줄
            asyncio.create_task(self._schedule_cleanup(sandbox_id))
            
            return sandbox_info
            
        except Exception as e:
            logger.error(f"Failed to create sandbox: {e}")
            return None
    
    async def destroy_sandbox(self, sandbox_id: str) -> bool:
        """컨테이너 정리"""
        if sandbox_id not in self.active_containers:
            return False
        
        try:
            info = self.active_containers[sandbox_id]
            container = self.client.containers.get(info["container_id"])
            container.stop(timeout=5)
            del self.active_containers[sandbox_id]
            return True
        except Exception as e:
            logger.error(f"Failed to destroy sandbox: {e}")
            return False
    
    async def _schedule_cleanup(self, sandbox_id: str):
        """타임아웃 후 자동 정리"""
        await asyncio.sleep(self.timeout)
        await self.destroy_sandbox(sandbox_id)
    
    async def _cleanup_expired(self):
        """만료된 컨테이너 정리"""
        now = datetime.utcnow()
        expired = [
            sid for sid, info in self.active_containers.items()
            if info["expires_at"] < now
        ]
        for sid in expired:
            await self.destroy_sandbox(sid)
    
    def get_sandbox_status(self, sandbox_id: str) -> Optional[dict]:
        """샌드박스 상태 조회"""
        return self.active_containers.get(sandbox_id)


# 싱글톤
sandbox_manager = SandboxManager()
