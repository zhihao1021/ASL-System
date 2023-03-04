from models import SessionBase

from typing import Optional

from sqlmodel import Field as SQLField


class SessionCreate(SessionBase):
    sid: Optional[str] = SQLField(
        nullable=False, foreign_key="UserData.sid", description="學號")
