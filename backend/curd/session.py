from .base import CURDBase

from aiosqlmodel import AsyncSession
from config import ENGINE, NOWTIME
from models import Session
from schemas import SessionCreate, SessionUpdate

from typing import Optional

from sqlmodel import select


class CURDSession(CURDBase[Session, SessionCreate, SessionUpdate]):
    def __init__(self) -> None:
        super().__init__(Session)

    async def get_by_session(
        self,
        session: str,
    ) -> Optional[Session]:
        if session == None:
            return None
        async with AsyncSession(ENGINE) as db_session:
            query_stat = select(Session).where(Session.session == session)
            result = await db_session.exec(query_stat)

            return result.first()
    
    async def get_by_sid(
        self,
        sid: str,
    ) -> Optional[list[Session]]:
        async with AsyncSession(ENGINE) as db_session:
            query_stat = select(Session).where(Session.sid == sid)
            result = await db_session.exec(query_stat)

            return result.all()

    async def update_time(
        self,
        obj: Session,
    ) -> Session:
        obj_update = SessionUpdate()
        obj_update.last_login = NOWTIME()
        return await self.update(obj, obj_update)
