import time
from collections import defaultdict
from fastapi import HTTPException, Request, status
from ..config.security import get_settings

settings = get_settings()


class RateLimiter:
    def __init__(self):
        self.requests = defaultdict(list)
    
    def is_allowed(self, key: str) -> bool:
        now = time.time()
        window_start = now - settings.RATE_LIMIT_WINDOW
        
        # 오래된 요청 제거
        self.requests[key] = [t for t in self.requests[key] if t > window_start]
        
        if len(self.requests[key]) >= settings.RATE_LIMIT_REQUESTS:
            return False
        
        self.requests[key].append(now)
        return True
    
    def get_remaining(self, key: str) -> int:
        now = time.time()
        window_start = now - settings.RATE_LIMIT_WINDOW
        self.requests[key] = [t for t in self.requests[key] if t > window_start]
        return max(0, settings.RATE_LIMIT_REQUESTS - len(self.requests[key]))


rate_limiter = RateLimiter()


async def rate_limit_middleware(request: Request):
    client_ip = request.client.host
    
    if not rate_limiter.is_allowed(client_ip):
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many requests. Please try again later.",
            headers={"Retry-After": str(settings.RATE_LIMIT_WINDOW)}
        )
    
    return True
