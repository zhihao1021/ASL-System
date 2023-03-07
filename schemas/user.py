from models import UserBase
from utils import optional


class UserCreate(UserBase):
    pass


@optional
class UserUpdate(UserBase):
    pass
