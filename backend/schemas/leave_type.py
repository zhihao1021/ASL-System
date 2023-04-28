from models import LeaveTypeBase
from utils import optional

class LeaveTypeCreate(LeaveTypeBase):
    pass


@optional
class LeaveTypeUpdate(LeaveTypeBase):
    pass
