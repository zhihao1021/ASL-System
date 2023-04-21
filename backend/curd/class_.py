from .base import CURDBase

from aiosqlmodel import AsyncSession
from config import ENGINE
from models import Class
from schemas import ClassCreate, ClassUpdate

from sqlmodel import select


class CURDClass(CURDBase[Class, ClassCreate, ClassUpdate]):
    def __init__(self) -> None:
        super().__init__(Class)

    async def get_all(self) -> list[Class]:
        async with AsyncSession(ENGINE) as db_session:
            query_stat = select(Class)
            result = await db_session.exec(query_stat)

            return result.all()

    async def get_by_class_code(
        self,
        class_code: int = None
    ) -> Class:
        if class_code == None:
            return None
        async with AsyncSession(ENGINE) as db_session:
            query_stat = select(Class).where(Class.class_code == class_code)
            result = await db_session.exec(query_stat)

            return result.first()
