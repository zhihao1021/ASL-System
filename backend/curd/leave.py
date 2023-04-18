from .base import CURDBase

from aiosqlmodel import AsyncSession
from config import ENGINE
from models import Leave
from schemas import LeaveCreate, LeaveUpdate

from typing import Optional

from sqlmodel import desc, select


class CURDLeave(CURDBase[Leave, LeaveCreate, LeaveUpdate]):
    def __init__(self) -> None:
        super().__init__(Leave)

    async def get_by_sid(
        self,
        sid: str,
        page: int = 0,
        num: int = 10
    ) -> list[Leave]:
        if sid == None:
            return []
        async with AsyncSession(ENGINE) as db_session:
            query_stat = select(Leave).where(Leave.sid == sid).order_by(desc(Leave.create_time)).offset(
                max(page * num, 0)).limit(max(num, 1))
            result = await db_session.exec(query_stat)

            return result.all()

    async def get_by_status(
        self,
        status: int
    ) -> list[Leave]:
        if status == None:
            return []
        async with AsyncSession(ENGINE) as db_session:
            query_stat = select(Leave).where(Leave.status == status)
            result = await db_session.exec(query_stat)

            return result.all()
