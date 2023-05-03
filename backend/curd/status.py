from .base import CURDBase

from aiosqlmodel import AsyncSession
from config import ENGINE
from models import Status
from schemas import StatusCreate, StatusUpdate

from typing import Union

from sqlmodel import select


class CURDStatus(CURDBase[Status, StatusCreate, StatusUpdate]):
    def __init__(self) -> None:
        super().__init__(Status)
        self.map = None
        self.h_map = None
    
    async def get_map(
        self,
        has_type: bool = False
    ) -> Union[dict[int, str], dict[int, list[str, int]]]:
        if has_type and self.h_map:
            return self.h_map
        elif not has_type and self.map:
            return self.map
        async with AsyncSession(ENGINE) as db_session:
            query_stat = select(Status)
            data_list = await db_session.exec(query_stat)
            data_list = data_list.all()

            if has_type:
                result = {
                    key: [value, status]
                    for key, value, status in zip(
                        map(lambda data: data.status_code, data_list),
                        map(lambda data: data.status_title, data_list),
                        map(lambda data: data.status_type, data_list)
                    )
                }
                self.h_map = result
            else:
                result = {
                    key: value
                    for key, value in zip(
                        map(lambda data: data.status_code, data_list),
                        map(lambda data: data.status_title, data_list)
                    )
                }
                self.map = result


            return result
