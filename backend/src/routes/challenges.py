from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from ..models.database import get_db
from ..models.challenge import Challenge
from ..schemas.challenge import ChallengeCreate, ChallengeUpdate, ChallengeResponse, FlagSubmit
from ..middleware.auth import get_current_user

router = APIRouter(prefix="/challenges", tags=["Challenges"])


@router.get("", response_model=List[ChallengeResponse])
async def get_challenges(db: AsyncSession = Depends(get_db)):
    """모든 활성 챌린지 조회"""
    result = await db.execute(
        select(Challenge)
        .where(Challenge.is_active == True)
        .order_by(Challenge.order, Challenge.created_at.desc())
    )
    return result.scalars().all()


@router.get("/{challenge_id}", response_model=ChallengeResponse)
async def get_challenge(challenge_id: str, db: AsyncSession = Depends(get_db)):
    """챌린지 상세 조회"""
    result = await db.execute(select(Challenge).where(Challenge.id == challenge_id))
    challenge = result.scalar_one_or_none()
    
    if not challenge:
        raise HTTPException(status_code=404, detail="챌린지를 찾을 수 없습니다")
    
    return challenge


@router.post("/{challenge_id}/submit")
async def submit_flag(
    challenge_id: str,
    flag_data: FlagSubmit,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """플래그 제출"""
    result = await db.execute(select(Challenge).where(Challenge.id == challenge_id))
    challenge = result.scalar_one_or_none()
    
    if not challenge:
        raise HTTPException(status_code=404, detail="챌린지를 찾을 수 없습니다")
    
    if flag_data.flag == challenge.flag:
        return {"correct": True, "message": "정답입니다! 🎉"}
    else:
        return {"correct": False, "message": "틀렸습니다. 다시 시도해보세요."}


@router.post("", response_model=ChallengeResponse, status_code=status.HTTP_201_CREATED)
async def create_challenge(
    challenge_data: ChallengeCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """챌린지 생성 (관리자 전용)"""
    challenge = Challenge(**challenge_data.model_dump())
    db.add(challenge)
    await db.commit()
    await db.refresh(challenge)
    
    return challenge


@router.put("/{challenge_id}", response_model=ChallengeResponse)
async def update_challenge(
    challenge_id: str,
    challenge_data: ChallengeUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """챌린지 수정 (관리자 전용)"""
    result = await db.execute(select(Challenge).where(Challenge.id == challenge_id))
    challenge = result.scalar_one_or_none()
    
    if not challenge:
        raise HTTPException(status_code=404, detail="챌린지를 찾을 수 없습니다")
    
    for key, value in challenge_data.model_dump(exclude_unset=True).items():
        setattr(challenge, key, value)
    
    await db.commit()
    await db.refresh(challenge)
    
    return challenge


@router.delete("/{challenge_id}")
async def delete_challenge(
    challenge_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """챌린지 삭제 (관리자 전용)"""
    result = await db.execute(select(Challenge).where(Challenge.id == challenge_id))
    challenge = result.scalar_one_or_none()
    
    if not challenge:
        raise HTTPException(status_code=404, detail="챌린지를 찾을 수 없습니다")
    
    await db.delete(challenge)
    await db.commit()
    
    return {"message": "챌린지가 삭제되었습니다"}