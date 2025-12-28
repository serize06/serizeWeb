from pydantic_settings import BaseSettings
from functools import lru_cache


class SecuritySettings(BaseSettings):
    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = 100
    RATE_LIMIT_WINDOW: int = 60  # seconds
    
    # Sandbox
    SANDBOX_TIMEOUT: int = 300  # 5 minutes
    SANDBOX_MAX_CONTAINERS: int = 10
    
    # Database
    DATABASE_URL: str = "postgresql+asyncpg://user:pass@localhost/serize"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    class Config:
        env_file = ".env"


@lru_cache()
def get_settings():
    return SecuritySettings()
