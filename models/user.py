from .base import IDBase

from sqlmodel import Field as SQLField


class UserBase(IDBase):
    sid: str = SQLField(unique=True, nullable=False, description="學號")
    account: str = SQLField(unique=True, nullable=False, description="登入帳號")
    password: str = SQLField(nullable=False, description="登入密碼")


class User(UserBase, table=True):
    __tablename__ = "UserData"
