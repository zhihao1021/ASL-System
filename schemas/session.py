from models import SessionBase
from utils import optional


class SessionCreate(SessionBase):
    pass


@optional
class SessionUpdate(SessionBase):
    pass
