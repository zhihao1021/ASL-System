from .base import CRUDBase

from aiosqlmodel import AsyncSession
from config import ENGINE
from models import Class
from schemas import ClassCreate, ClassUpdate

from sqlmodel import select


class CRUDClass(CRUDBase[Class, ClassCreate, ClassUpdate]):
    def __init__(self) -> None:
        super().__init__(Class)

    async def get_all(self) -> list[Class]:
        async with AsyncSession(ENGINE) as db_session:
            query_stat = select(Class).where(Class.class_code != -1)
            result = await db_session.exec(query_stat)

            return result.all()

    async def get_by_class_code(
        self,
        class_code: int = None
    ) -> Class:
        if class_code is None:
            return None
        async with AsyncSession(ENGINE) as db_session:
            query_stat = select(Class).where(Class.class_code == class_code)
            result = await db_session.exec(query_stat)

            return result.first()
