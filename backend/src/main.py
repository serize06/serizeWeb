from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes.auth import router as auth_router
from .routes.projects import router as projects_router
from .routes.challenges import router as challenges_router
from .models.database import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
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


@app.get("/")
async def root():
    return {"message": "SerizeWeb API", "status": "running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}