from .base import CURDBase

from aiosqlmodel import AsyncSession
from config import ENGINE
from models import Status
from schemas import StatusCreate, StatusUpdate

from typing import Optional

from sqlmodel import select


class CURDStatus(CURDBase[Status, StatusCreate, StatusUpdate]):
    def __init__(self) -> None:
        super().__init__(Status)

    async def get_by_status_code(
        self,
        status_code: int = None,
    ) -> Optional[Status]:
        if status_code is None:
            return None
        async with AsyncSession(ENGINE) as db_session:
            query_stat = select(Status).where(Status.status_code == status_code)
            result = await db_session.exec(query_stat)

            return result.first()
