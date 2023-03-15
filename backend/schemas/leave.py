from models import LeaveBase
from utils import optional


class LeaveCreate(LeaveBase):
    pass


@optional
class LeaveUpdate(LeaveBase):
    pass
