from .base import CURDBase

from aiosqlmodel import AsyncSession
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
        db_session: Optional[AsyncSession] = None
    ) -> Optional[User]:
        if account == None:
            return None
        db_session = db_session or self.db

        query_stat = select(User).where(User.account == account)
        result = await db_session.exec(query_stat)

        return result.first()

    async def get_by_sid(
        self,
        sid: str,
        db_session: Optional[AsyncSession] = None
    ) -> Optional[User]:
        if sid == None:
            return None
        db_session = db_session or self.db

        query_stat = select(User).where(User.sid == sid)
        result = await db_session.exec(query_stat)

        return result.first()
