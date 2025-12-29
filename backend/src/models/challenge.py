from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ChallengeCreate(BaseModel):
    title: str
    description: str
    difficulty: str = "medium"
    category: Optional[str] = None
    points: int = 100
    flag: Optional[str] = None
    hint: Optional[str] = None
    file_url: Optional[str] = None
    order: int = 0


class ChallengeUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    difficulty: Optional[str] = None
    category: Optional[str] = None
    points: Optional[int] = None
    flag: Optional[str] = None
    hint: Optional[str] = None
    file_url: Optional[str] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class ChallengeResponse(BaseModel):
    id: str
    title: str
    description: str
    difficulty: str
    category: Optional[str]
    points: int
    hint: Optional[str]
    file_url: Optional[str]
    is_active: bool
    order: int
    created_at: datetime

    class Config:
        from_attributes = True


class FlagSubmit(BaseModel):
    flag: str