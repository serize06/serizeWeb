from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from ..models.database import get_db
from ..models.challenge import Challenge
from ..models.solve import Solve
from ..models.user import User
from ..schemas.challenge import ChallengeCreate, ChallengeUpdate, ChallengeResponse, FlagSubmit
from ..middleware.auth import get_current_user

router = APIRouter(prefix="/challenges", tags=["Challenges"])


@router.get("", response_model=List[ChallengeResponse])
async def get_challenges(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Challenge)
        .where(Challenge.is_active == True)
        .order_by(Challenge.order, Challenge.created_at.desc())
    )
    return result.scalars().all()


@router.get("/{challenge_id}", response_model=ChallengeResponse)
async def get_challenge(challenge_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Challenge).where(Challenge.id == challenge_id))
    challenge = result.scalar_one_or_none()
    if not challenge:
        raise HTTPException(status_code=404, detail="챌린지를 찾을 수 없습니다")
    return challenge


@router.post("/{challenge_id}/submit")
async def submit_flag(
    challenge_id: str,
    flag_data: FlagSubmit,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Challenge).where(Challenge.id == challenge_id))
    challenge = result.scalar_one_or_none()
    
    if not challenge:
        raise HTTPException(status_code=404, detail="챌린지를 찾을 수 없습니다")
    
    # 이미 푼 문제인지 확인
    existing_solve = await db.execute(
        select(Solve).where(
            Solve.user_id == current_user.id,
            Solve.challenge_id == challenge_id
        )
    )
    if existing_solve.scalar_one_or_none():
        return {"correct": False, "message": "이미 푼 문제입니다."}
    
    # 플래그 확인
    if flag_data.flag == challenge.flag:
        # 풀이 기록 저장
        solve = Solve(
            user_id=current_user.id,
            challenge_id=challenge_id,
            points_earned=challenge.points
        )
        db.add(solve)
        
        # 유저 포인트 증가
        current_user.points = (current_user.points or 0) + challenge.points
        
        await db.commit()
        
        return {"correct": True, "message": f"정답입니다! +{challenge.points}점"}
    else:
        return {"correct": False, "message": "틀렸습니다. 다시 시도해보세요."}


@router.post("", response_model=ChallengeResponse, status_code=status.HTTP_201_CREATED)
async def create_challenge(
    challenge_data: ChallengeCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    challenge = Challenge(**challenge_data.model_dump())
    db.add(challenge)
    await db.commit()
    await db.refresh(challenge)
    return challenge


@router.put("/{challenge_id}", response_model=ChallengeResponse)
async def update_challenge(
    challenge_id: str,
    challenge_data: ChallengeUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
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
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Challenge).where(Challenge.id == challenge_id))
    challenge = result.scalar_one_or_none()
    
    if not challenge:
        raise HTTPException(status_code=404, detail="챌린지를 찾을 수 없습니다")
    
    await db.delete(challenge)
    await db.commit()
    return {"message": "챌린지가 삭제되었습니다"}