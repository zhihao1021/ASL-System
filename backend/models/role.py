from .base import IDBase

from typing import Optional

from sqlmodel import Field as SQLField


class RoleBase(IDBase):
    role_code: int = SQLField(unique=True, nullable=False, description="身份組代碼")
    role_name: str = SQLField(nullable=False, description="身份組名稱")
    permissions: int = SQLField(0, nullable=False, description="身份組權限")
    search_status: Optional[int] = SQLField(
        None, nullable=True, description="驗證狀態", foreign_key="Status.status_code")
    accept_status: Optional[int] = SQLField(
        None, nullable=True, description="同意後狀態", foreign_key="Status.status_code")
    reject_status: Optional[int] = SQLField(
        None, nullable=True, description="拒絕後狀態", foreign_key="Status.status_code")
    late_status: Optional[int] = SQLField(
        None, nullable=True, description="同意後狀態(遲交)", foreign_key="Status.status_code")
    late_days: Optional[int] = SQLField(
        None, nullable=True, description="遲交天數閾值")


class Role(RoleBase, table=True):
    __tablename__ = "Role"
