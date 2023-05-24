from .base import IDBase

from sqlmodel import Field as SQLField


class StatusBase(IDBase):
    status_code: int = SQLField(
        unique=True, nullable=False, description="狀態代碼")
    status_title: str = SQLField(nullable=False, description="狀態")
    status_type: int = SQLField(
        0, nullable=False, description="類別(0=等待, 1=完成, 2=退回)")


class Status(StatusBase, table=True):
    __tablename__ = "Status"
