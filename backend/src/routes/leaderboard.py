from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from ..models.database import get_db
from ..models.user import User

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])


@router.get("")
async def get_leaderboard(db: AsyncSession = Depends(get_db)):
    """포인트 순위 조회"""
    result = await db.execute(
        select(User)
        .where(User.is_active == True)
        .order_by(User.points.desc())
        .limit(50)
    )
    users = result.scalars().all()
    
    return [
        {
            "rank": i + 1,
            "username": user.username,
            "points": user.points or 0
        }
        for i, user in enumerate(users)
    ]