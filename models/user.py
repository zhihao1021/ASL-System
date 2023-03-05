from .base import IDBase

from sqlmodel import Column, Field as SQLField, JSON


class UserBase(IDBase):
    sid: str = SQLField(unique=True, nullable=False, description="學號")
    account: str = SQLField(unique=True, nullable=False, description="登入帳號")
    password: str = SQLField(nullable=False, description="登入密碼")
    # roles: list[int] = SQLField([], nullable=False, sa_column=Column(JSON), description="身分組")


class User(UserBase, table=True):
    __tablename__ = "UserData"
