from .base import IDBase

from sqlmodel import Field as SQLField
    

class LeaveType(IDBase, table=True):
    __tablename__ = "LeaveTypeData"
    name: type = SQLField(unique=True, nullable=False, description="假別名稱")
