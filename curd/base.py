from aiosqlmodel import AsyncSession
from config import ENGINE
from models import IDBase

from typing import Any, Generic, Optional, Type, TypeVar, Union

from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
from sqlalchemy.exc import IntegrityError
from sqlmodel import select
from sqlmodel.sql.base import Executable
from sqlmodel.sql.expression import Select, SelectOfScalar

ModelType = TypeVar("ModelType", bound=IDBase)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)
SchemaType = TypeVar("SchemaType", bound=BaseModel)

_TSelectParam = TypeVar("_TSelectParam")


class CURDBase(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType], db_session: Optional[AsyncSession] = None) -> None:
        self.model = model

        self.db = db_session or AsyncSession(ENGINE)

    async def get(self, id: int, db_session: Optional[AsyncSession] = None) -> Optional[ModelType]:
        db_session = db_session or self.db

        query_stat = select(self.model).where(self.model.id == id)
        result = await db_session.exec(query_stat)
        return result.first()

    async def get_by_ids(self, ids: list[int], db_session: Optional[AsyncSession] = None) -> Optional[list[ModelType]]:
        db_session = db_session or self.db

        query_stat = select(self.model).where(self.model.id.in_(ids))
        result = await db_session.exec(query_stat)
        return result.all()

    async def get_range(
        self,
        statement: Union[
            Select[_TSelectParam],
            SelectOfScalar[_TSelectParam],
            Executable[_TSelectParam]
        ],
        db_session: Optional[AsyncSession] = None,
        start: Optional[int] = None,
        length: Optional[int] = None
    ) -> Optional[list[ModelType]]:
        db_session = db_session or self.db

        query_stat = statement
        query_stat = query_stat.offset(start) if start else query_stat
        query_stat = query_stat.limit(length) if length else query_stat

        result = await db_session.exec(query_stat)
        return result.all()

    async def create(
        self,
        obj: CreateSchemaType,
        db_session: Optional[AsyncSession] = None
    ) -> ModelType:
        db_session = db_session or self.db

        obj = self.model.from_orm(obj)

        try:
            db_session.add(obj)
            await db_session.commit()
        except IntegrityError:
            await db_session.rollback()
        await db_session.refresh(obj)
        return obj

    async def update(
        self,
        obj: ModelType,
        obj_update: Union[UpdateSchemaType, dict[str, Any], ModelType],
        db_session: Optional[AsyncSession] = None,
    ) -> ModelType:
        db_session = db_session or self.db
        obj_data = jsonable_encoder(obj)

        if isinstance(obj_update, dict):
            update_data = obj_update
        else:
            update_data = obj_update.dict(
                exclude_unset=True
            )  # This tells Pydantic to not include the values that were not sent
        for field in obj_data:
            if field in update_data:
                setattr(obj, field, update_data[field])

        db_session.add(obj)
        await db_session.commit()
        await db_session.refresh(obj)
        return obj

    async def delete(
        self,
        obj: Optional[ModelType] = None,
        id: Optional[int] = None,
        db_session: Optional[AsyncSession] = None
    ) -> ModelType:
        db_session = db_session or self.db

        obj = obj if obj else await self.get(id, db_session)

        await db_session.delete(obj)
        await db_session.commit()

        return obj
