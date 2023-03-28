from models import ClassBase
from utils import optional


class ClassCreate(ClassBase):
    pass


@optional
class ClassUpdate(ClassBase):
    pass
