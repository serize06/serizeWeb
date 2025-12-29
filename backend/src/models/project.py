from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ProjectCreate(BaseModel):
    title: str
    description: str
    image_url: Optional[str] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    tags: Optional[str] = None
    is_featured: bool = False
    order: int = 0


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    github_url: Optional[str] = None
    demo_url: Optional[str] = None
    tags: Optional[str] = None
    is_featured: Optional[bool] = None
    order: Optional[int] = None
    is_active: Optional[bool] = None


class ProjectResponse(BaseModel):
    id: str
    title: str
    description: str
    image_url: Optional[str]
    github_url: Optional[str]
    demo_url: Optional[str]
    tags: Optional[str]
    is_featured: bool
    order: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True