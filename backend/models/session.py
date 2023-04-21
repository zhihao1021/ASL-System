from .base import IDBase

from config import NOWTIME

from datetime import datetime

from sqlmodel import Column, Field as SQLField, JSON, String


class SessionBase(IDBase):
    session: str = SQLField(unique=True, nullable=False,
                            description="登入Session")
    sid: str = SQLField(
        nullable=False, foreign_key="UserData.sid", description="學號")
    last_login: datetime = SQLField(
        default_factory=NOWTIME, nullable=False, sa_column=Column(String()), description="最後登入時間")
    ip: str = SQLField(
        nullable=False, description="登入IP")
    user_data: dict = SQLField({}, sa_column=Column(JSON()), description="使用者資料")
    role_data: dict = SQLField({}, sa_column=Column(JSON()), description="權限資料")


class Session(SessionBase, table=True):
    __tablename__ = "SessionData"
