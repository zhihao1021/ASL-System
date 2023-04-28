from .base import IDBase

from config import NOWTIME

from datetime import date, datetime

from sqlmodel import Column, Field as SQLField, String


class LeaveBase(IDBase):
    sid: str = SQLField(
        nullable=False, description="學號", foreign_key="UserData.sid")
    type: int = SQLField(nullable=False, description="假別",
                         foreign_key="LeaveType.leave_code")
    start_date: date = SQLField(
        nullable=False, sa_column=Column(String()), description="起始日期")
    end_date: date = SQLField(
        nullable=False, sa_column=Column(String()), description="結束日期")
    start_lesson: int = SQLField(
        nullable=False, description="開始節次", foreign_key="Lesson.lesson_code")
    end_lesson: int = SQLField(
        nullable=False, description="結束節次", foreign_key="Lesson.lesson_code")
    remark: str = SQLField("", nullable=False, description="備註")
    status: int = SQLField(0, nullable=False, description="狀態",
                           foreign_key="Status.status_code")
    files: int = SQLField(0, ge=0, nullable=False, description="檔案數量")
    reject_reason: str = SQLField("", nullable=True, description="拒絕原因")
# 0001 送出
# 0010 導師核准
# 0100 教官核准
# 1000 學務主任核准


class Leave(LeaveBase, table=True):
    __tablename__ = "LeaveData"
    create_time: datetime = SQLField(
        default_factory=NOWTIME, nullable=False, sa_column=Column(String()), description="新增時間")

    def late_time(self) -> int:
        c_date = datetime.fromisoformat(self.create_time).date()
        l_date = date.fromisoformat(self.start_date)

        return (c_date - l_date).days
