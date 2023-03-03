from aiosqlmodel import AsyncSession, UserData
from config import ENGINE

from typing import Optional

from pydantic import BaseModel
from sqlmodel import select

class EncryptLoginData(BaseModel):
    account: str
    password: str

    async def valid(self) -> Optional[bool]:
        async with AsyncSession(ENGINE) as session:
            query_sata = select(UserData).where(UserData.account == self.account)
            results = await session.exec(query_sata)
            result = results.first()

        if result == None:
            return None
        if result.password == self.password:
            return True
        return False
            
            
