from .base import CURDBase

from aiosqlmodel import AsyncSession
from config import ENGINE
from models import User
from schemas import UserCreate, UserUpdate

from typing import Optional

from sqlmodel import select


class CURDUser(CURDBase[User, UserCreate, UserUpdate]):
    def __init__(self) -> None:
        super().__init__(User)

    async def get_by_account(
        self,
        account: str,
    ) -> Optional[User]:
        if account == None:
            return None
        async with AsyncSession(ENGINE) as db_session:
            query_stat = select(User).where(User.account == account)
            result = await db_session.exec(query_stat)

            return result.first()

    async def get_by_sid(
        self,
        sid: str,
    ) -> Optional[User]:
        if sid == None:
            return None
        async with AsyncSession(ENGINE) as db_session:
            query_stat = select(User).where(User.sid == sid)
            result = await db_session.exec(query_stat)

            return result.first()
    
    async def get_by_class_id(
        self,
        class_id: int,
    ) -> list[User]:
        if class_id == None:
            return []
        async with AsyncSession(ENGINE) as db_session:
            query_stat = select(User).where(User.class_id == class_id)
            result = await db_session.exec(query_stat)

            return result.all()
