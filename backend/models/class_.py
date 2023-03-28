from .base import IDBase

from sqlmodel import Field as SQLField


class ClassBase(IDBase):
    class_name: str = SQLField(nullable=False, description="班級名稱")


class Class(ClassBase, table=True):
    __tablename__ = "ClassData"
