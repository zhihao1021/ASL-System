from .base import CURDBase

from aiosqlmodel import AsyncSession
from config import ENGINE
from models import Role
from schemas import RoleCreate, RoleUpdate

from typing import Optional

from sqlmodel import select


class CURDRole(CURDBase[Role, RoleCreate, RoleUpdate]):
    def __init__(self) -> None:
        super().__init__(Role)

    async def get_by_role_code(
        self,
        role_code: int = None,
    ) -> Optional[Role]:
        if role_code is None:
            return None
        async with AsyncSession(ENGINE) as db_session:
            query_stat = select(Role).where(Role.role_code == role_code)
            result = await db_session.exec(query_stat)

            return result.first()
