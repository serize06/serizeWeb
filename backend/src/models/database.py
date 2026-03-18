import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./app.db")

# PostgreSQL URL 변환 (Railway 형식 → asyncpg 형식)
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


async def init_db():
    from .user import User
    from .project import Project
    from .challenge import Challenge
    from .solve import Solve

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        # 기존 테이블에 새 컬럼 추가 (없으면)
        try:
            await conn.execute(
                __import__('sqlalchemy').text(
                    "ALTER TABLE challenges ADD COLUMN challenge_type VARCHAR(100)"
                )
            )
        except Exception:
            pass  # 이미 있으면 무시