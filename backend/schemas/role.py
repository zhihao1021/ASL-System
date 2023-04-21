from models import RoleBase
from utils import optional


class RoleCreate(RoleBase):
    pass


@optional
class RoleUpdate(RoleBase):
    pass
