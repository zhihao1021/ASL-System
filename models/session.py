from .base import IDBase

from aiosqlmodel import AsyncSession
from config import ENGINE, NOWTIME

from datetime import datetime
from typing import Optional

from sqlmodel import Column, Field as SQLField, String, SQLModel


class SessionBase(IDBase):
    session: str = SQLField(unique=True, nullable=False,
                            description="登入Session")
    sid: Optional[str] = SQLField(
        nullable=False, foreign_key="UserData.sid", description="學號")
    last_login: datetime = SQLField(
        default_factory=NOWTIME, nullable=False, sa_column=Column(String()), description="最後登入時間")


class Session(SessionBase, table=True):
    __tablename__ = "SessionData"
