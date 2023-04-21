from .base import IDBase

from sqlmodel import Field as SQLField


class LeaveTypeBase(IDBase):
    leave_code: int = SQLField(unique=True, nullable=False, description="假別代碼")
    leave_name: str = SQLField(nullable=False, description="假別名稱")

class LeaveType(LeaveTypeBase, table=True):
    __tablename__ = "LeaveType"
