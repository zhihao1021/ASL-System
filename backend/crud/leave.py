from .base import CRUDBase

from aiosqlmodel import AsyncSession
from config import ENGINE
from models import Leave
from schemas import LeaveCreate, LeaveUpdate

from typing import Optional

from sqlmodel import desc, select


class CRUDLeave(CRUDBase[Leave, LeaveCreate, LeaveUpdate]):
    def __init__(self) -> None:
        super().__init__(Leave)

    async def get_all(
        self,
        page: int = 0,
        num: int = 10,
        finished: bool = False,
    ) -> list[Leave]:
        async with AsyncSession(ENGINE) as db_session:
            if finished:
                query_stat = select(Leave).where(Leave.status == 8)
            else:
                query_stat = select(Leave)

            if page == -1:
                query_stat = query_stat.order_by(Leave.id)
            else:
                query_stat = query_stat.order_by(desc(Leave.create_time)).offset(
                    max(page * num, 0)).limit(max(num, 1))
            result = await db_session.exec(query_stat)

            return result.all()

    async def get_by_sid(
        self,
        sid: str = None,
        page: int = 0,
        num: int = 10,
        finished: bool = False,
    ) -> list[Leave]:
        if sid is None:
            return []
        async with AsyncSession(ENGINE) as db_session:
            if finished:
                query_stat = select(Leave).where(Leave.status == 8)
            else:
                query_stat = select(Leave)

            if page == -1:
                query_stat = query_stat.where(
                    Leave.sid == sid).order_by(Leave.id)
            else:
                query_stat = query_stat.where(Leave.sid == sid).order_by(desc(Leave.create_time)).offset(
                    max(page * num, 0)).limit(max(num, 1))
            result = await db_session.exec(query_stat)

            return result.all()

    async def get_by_status(
        self,
        status: int = None,
        ids: Optional[list[str]] = None,
        limit: int = 10
    ) -> list[Leave]:
        if status is None:
            return []
        async with AsyncSession(ENGINE) as db_session:
            query_stat = select(Leave).where(
                Leave.status == status).order_by(Leave.create_time)
            if ids:
                query_stat = query_stat.where(Leave.sid.in_(ids))
            if limit != -1:
                query_stat = query_stat.limit(max(limit, 1))
            result = await db_session.exec(query_stat)

            return result.all()
