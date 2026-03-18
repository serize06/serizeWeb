import os
import httpx
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional

from ..models.user import User
from ..middleware.auth import get_current_user

router = APIRouter(prefix="/instances", tags=["Instances"])

INSTANCE_API = os.environ.get("INSTANCE_API_URL", "http://140.245.79.35:31337")
INSTANCE_SECRET = os.environ.get("INSTANCE_SECRET", "ch4ng3-th1s-s3cr3t")


class CreateRequest(BaseModel):
    challenge_type: str


class DestroyRequest(BaseModel):
    instance_id: str


@router.post("/create")
async def create_instance(
    req: CreateRequest,
    current_user: User = Depends(get_current_user),
):
    async with httpx.AsyncClient(timeout=30) as client:
        try:
            resp = await client.post(
                f"{INSTANCE_API}/create",
                json={"challenge_type": req.challenge_type, "user_id": current_user.id},
                headers={"X-Secret": INSTANCE_SECRET},
            )
            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail=resp.json().get("error", "failed"))
            return resp.json()
        except httpx.ConnectError:
            raise HTTPException(status_code=503, detail="Instance server unreachable")


@router.post("/destroy")
async def destroy_instance(
    req: DestroyRequest,
    current_user: User = Depends(get_current_user),
):
    async with httpx.AsyncClient(timeout=15) as client:
        try:
            resp = await client.post(
                f"{INSTANCE_API}/destroy",
                json={"instance_id": req.instance_id},
                headers={"X-Secret": INSTANCE_SECRET},
            )
            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail=resp.json().get("error", "failed"))
            return resp.json()
        except httpx.ConnectError:
            raise HTTPException(status_code=503, detail="Instance server unreachable")


@router.get("/status/{instance_id}")
async def instance_status(
    instance_id: str,
    current_user: User = Depends(get_current_user),
):
    async with httpx.AsyncClient(timeout=10) as client:
        try:
            resp = await client.get(
                f"{INSTANCE_API}/status/{instance_id}",
                headers={"X-Secret": INSTANCE_SECRET},
            )
            if resp.status_code != 200:
                raise HTTPException(status_code=resp.status_code, detail=resp.json().get("error", "failed"))
            return resp.json()
        except httpx.ConnectError:
            raise HTTPException(status_code=503, detail="Instance server unreachable")
