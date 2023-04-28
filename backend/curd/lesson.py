from .base import CURDBase

from aiosqlmodel import AsyncSession
from config import ENGINE
from models import Lesson
from schemas import LessonCreate, LessonUpdate

from sqlmodel import select


class CURDLesson(CURDBase[Lesson, LessonCreate, LessonUpdate]):
    def __init__(self) -> None:
        super().__init__(Lesson)
        self.map = None

    async def get_map(
        self,
    ) -> dict[int, str]:
        if self.map:
            return self.map
        async with AsyncSession(ENGINE) as db_session:
            query_stat = select(Lesson)
            data_list = await db_session.exec(query_stat)
            data_list = data_list.all()

            result = {
                key: value
                for key, value in zip(
                    map(lambda data: data.lesson_code, data_list),
                    map(lambda data: data.lesson_name, data_list)
                )
            }

            self.map = result

            return result
