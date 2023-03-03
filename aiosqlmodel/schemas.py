from .session import AsyncSession

from config import ENGINE, NOWTIME

from asyncio import run
from datetime import datetime
from typing import Optional

from sqlmodel import Column, Field as SQLField, String, SQLModel


DEBUG = True


class UserData(SQLModel, table=True):
    __tablename__ = "UserData"
    id: Optional[int] = SQLField(
        None, primary_key=True, unique=True, description="ID")
    sid: str = SQLField(unique=True, nullable=False, description="學號")
    account: str = SQLField(unique=True, nullable=False, description="登入帳號")
    password: str = SQLField(nullable=False, description="登入密碼")


class SessionData(SQLModel, table=True):
    __tablename__ = "SessionData"
    session: str = SQLField(primary_key=True, unique=True,
                            nullable=False, description="登入Session")
    last_login: datetime = SQLField(
        default_factory=NOWTIME, nullable=False, sa_column=Column(String()), description="最後登入時間")
    sid: Optional[str] = SQLField(
        nullable=False, foreign_key="UserData.sid", description="學號")

    async def update_time(self):
        # 更新最後登入時間
        self.last_login = NOWTIME()

        async with AsyncSession(ENGINE) as session:
            session.add(self)
            await session.commit()


async def sql_init():
    async with ENGINE.begin() as conn:
        if DEBUG:
            await conn.run_sync(SQLModel.metadata.drop_all)
        await conn.run_sync(SQLModel.metadata.create_all)

    if DEBUG:
        async with AsyncSession(ENGINE) as session:
            session.add(
                UserData(**{"sid": "000", "account": "admin", "password": "admin"}))
            session.add(
                UserData(**{"sid": "001", "account": "alice", "password": "alice"}))

            await session.commit()

run(sql_init())
