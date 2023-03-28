from models import LeaveBase
from utils import optional

from datetime import date
from typing import Union

from pydantic import validator


class LeaveCreate(LeaveBase):
    @validator("start_date", "end_date")
    def date_validator(cls, value: Union[str, date]):
        if type(value) != date:
            value = date.fromisoformat(value)
        return value


@optional
class LeaveUpdate(LeaveBase):
    pass
