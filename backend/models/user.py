from .base import IDBase

from typing import Optional

from sqlmodel import Field as SQLField


class UserBase(IDBase):
    sid: str = SQLField(unique=True, nullable=False, description="學號")
    account: str = SQLField(unique=True, nullable=False, description="登入帳號")
    password: str = SQLField(nullable=False, description="登入密碼")
    name: str = SQLField(nullable=False, description="姓名")
    role: int = SQLField(0, nullable=False, description="身分組")
    class_id: Optional[int] = SQLField(None, nullable=True, foreign_key="ClassData.id")


class User(UserBase, table=True):
    __tablename__ = "UserData"
