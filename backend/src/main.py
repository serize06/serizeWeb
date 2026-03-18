import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .routes.auth import router as auth_router
from .routes.projects import router as projects_router
from .routes.challenges import router as challenges_router
from .routes.leaderboard import router as leaderboard_router
from .models.database import init_db, AsyncSessionLocal
from .models.challenge import Challenge
from sqlalchemy import select


async def seed_challenges():
    """서버 시작 시 기본 챌린지 자동 시드 (이미 있으면 스킵)"""
    challenges = [
        {
            "title": "3D Model Inspector",
            "description": (
                "우리 회사에서 새로 만든 3D Model Inspector 서비스!\n"
                "glTF 모델을 업로드하면 vertex 데이터를 추출해줍니다.\n"
                "cgltf_validate()도 호출하고, vertex 수도 4096개로 제한했으니 안전하겠죠?\n\n"
                "nc HOST 31337"
            ),
            "difficulty": "medium",
            "category": "Pwn",
            "points": 300,
            "flag": "FLAG{h34p_0v3rr34d_1n_cgl7f_4cc3ss0r_r34d_fl04t}",
            "hint": "cgltf_accessor_read_float()에서 buffer 범위 검사를 확인해보세요. accessor의 count와 buffer의 byteLength가 다르면?",
            "file_url": "/static/challenges/cgltf-oob-read/files.tar.gz",
            "is_active": True,
            "order": 10,
        },
    ]

    async with AsyncSessionLocal() as session:
        for data in challenges:
            result = await session.execute(
                select(Challenge).where(Challenge.title == data["title"])
            )
            if not result.scalar_one_or_none():
                session.add(Challenge(**data))
        await session.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    await seed_challenges()
    yield


app = FastAPI(
    title="SerizeWeb API",
    description="Security Research & POC Platform",
    version="0.1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(projects_router, prefix="/api")
app.include_router(challenges_router, prefix="/api")
app.include_router(leaderboard_router, prefix="/api")

static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
if os.path.isdir(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")


@app.get("/")
async def root():
    return {"message": "SerizeWeb API", "status": "running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}