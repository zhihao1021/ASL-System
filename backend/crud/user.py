from .base import CRUDBase

from aiosqlmodel import AsyncSession
from config import ENGINE
from models import User
from schemas import UserCreate, UserUpdate

from typing import Optional

from sqlmodel import select


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def __init__(self) -> None:
        super().__init__(User)

    async def get_by_account(
        self,
        account: str = None,
    ) -> Optional[User]:
        if account is None:
            return None
        async with AsyncSession(ENGINE) as db_session:
            query_stat = select(User).where(User.account == account)
            result = await db_session.exec(query_stat)

            return result.first()

    async def get_by_sid(
        self,
        sid: str = None,
    ) -> Optional[User]:
        if sid is None:
            return None
        async with AsyncSession(ENGINE) as db_session:
            query_stat = select(User).where(User.sid == sid)
            result = await db_session.exec(query_stat)

            return result.first()

    async def get_by_class_code(
        self,
        class_code: int = None,
        role: Optional[int] = None
    ) -> list[User]:
        if class_code is None:
            return []
        async with AsyncSession(ENGINE) as db_session:
            query_stat = select(User).where(User.class_code == class_code)
            if role:
                query_stat = query_stat.where(User.role == role)
            result = await db_session.exec(query_stat)

            return result.all()
