from .base import CURDBase

from models import Class
from schemas import ClassCreate, ClassUpdate


class CURDClass(CURDBase[Class, ClassCreate, ClassUpdate]):
    def __init__(self) -> None:
        super().__init__(Class)
