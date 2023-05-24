from .base import IDBase

from sqlmodel import Field as SQLField


class LessonBase(IDBase):
    lesson_code: int = SQLField(
        unique=True, nullable=False, description="節次代碼")
    lesson_name: str = SQLField(nullable=False, description="節次名稱")


class Lesson(LessonBase, table=True):
    __tablename__ = "Lesson"
