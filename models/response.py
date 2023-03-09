from typing import Any

from pydantic import BaseModel


class CustomResponse(BaseModel):
    status: int
    success: bool
    data: Any = None
