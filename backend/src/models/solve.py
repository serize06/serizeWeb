from sqlalchemy import Column, String, DateTime, ForeignKey, Integer
from sqlalchemy.sql import func
from .database import Base
import uuid


class Solve(Base):
    __tablename__ = "solves"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    challenge_id = Column(String(36), ForeignKey("challenges.id"), nullable=False)
    points_earned = Column(Integer, nullable=False)
    solved_at = Column(DateTime, server_default=func.now())