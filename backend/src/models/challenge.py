from sqlalchemy import Column, String, Text, Boolean, DateTime, Integer
from sqlalchemy.sql import func
from .database import Base
import uuid


class Challenge(Base):
    __tablename__ = "challenges"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    difficulty = Column(String(20), default="medium")
    category = Column(String(100), nullable=True)
    points = Column(Integer, default=100)
    flag = Column(String(200), nullable=True)
    hint = Column(Text, nullable=True)
    file_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())