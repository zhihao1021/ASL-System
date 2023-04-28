from models import LessonBase
from utils import optional

class LessonCreate(LessonBase):
    pass


@optional
class LessonUpdate(LessonBase):
    pass
