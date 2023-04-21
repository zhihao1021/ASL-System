from models import StatusBase
from utils import optional


class StatusCreate(StatusBase):
    pass


@optional
class StatusUpdate(StatusBase):
    pass
