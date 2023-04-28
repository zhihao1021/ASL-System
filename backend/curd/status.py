from .base import CURDBase

from aiosqlmodel import AsyncSession
from config import ENGINE
from models import Status
from schemas import StatusCreate, StatusUpdate

from sqlmodel import select


class CURDStatus(CURDBase[Status, StatusCreate, StatusUpdate]):
    def __init__(self) -> None:
        super().__init__(Status)
        self.map = None
    
    async def get_map(
        self,
    ) -> dict[int, str]:
        if self.map:
            return self.map
        async with AsyncSession(ENGINE) as db_session:
            query_stat = select(Status)
            data_list = await db_session.exec(query_stat)
            data_list = data_list.all()

            result = {
                key: value
                for key, value in zip(
                    map(lambda data: data.status_code, data_list),
                    map(lambda data: data.status_title, data_list)
                )
            }

            self.map = result

            return result
