from .base import CURDBase

from aiosqlmodel import AsyncSession
from config import NOWTIME
from models import Session
from schemas import SessionCreate

from typing import Optional

from sqlmodel import select


class CURDSession(CURDBase[Session, SessionCreate]):
    def __init__(self) -> None:
        super().__init__(Session)

    async def get_by_session(
        self,
        session: str,
        db_session: Optional[AsyncSession] = None
    ) -> Optional[Session]:
        if session == None:
            return None
        db_session = db_session or self.db

        query_stat = select(Session)
        result = await db_session.exec(query_stat)

        return result.first()

    async def update_time(
        self,
        obj: Session,
        db_session: Optional[AsyncSession] = None
    ) -> Session:
        obj.last_login = NOWTIME()
        return await self.update(obj, db_session)
