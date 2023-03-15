from .threading_ import Thread
from .util import string_exception

from io import BytesIO
from logging import getLogger, Logger
from random import choice, randint
from time import sleep, time
from typing import Optional, Union

from PIL import Image, ImageDraw, ImageFont

FONTS = tuple(map(lambda i: ImageFont.truetype(
    "Mynerve-Regular.ttf", size=i), range(128, 160)))


def random_color(l: int = 0, u: int = 255) -> tuple[int]:
    return tuple(map(lambda x: randint(l, u), range(3)))


def random_string() -> str:
    return f"{randint(10, 50)}+{randint(10, 50)}="


def gen_valid_code() -> tuple[str, bytes]:
    img = Image.new("RGB", (512, 168), random_color(155))
    draw = ImageDraw.Draw(img)
    answer = random_string()
    for i in range(randint(5, 10)):
        x1, x2, x3 = map(lambda x: randint(0, 512), range(3))
        y1, y2, y3 = map(lambda x: randint(0, 168), range(3))
        draw.line((x1, y1, x2, y2), fill=random_color(), width=randint(5, 24))
        for _ in range(randint(1, 5)):
            draw.arc((x3, y3, x3 + randint(-256, 256), y3 + randint(-84, 84)),
                     randint(0, 360), randint(0, 360), random_color(), randint(5, 24))
    for i, s in enumerate(answer):
        draw.text((80 * i, randint(-24, 24)), s,
                  random_color(0, 140), choice(FONTS), stroke_width=randint(1, 3))
    io = BytesIO()
    img.save(io, format="jpeg")
    answer = str(eval(answer.removesuffix("=")))
    return answer, io.getvalue()


class ValidCodeDict:
    def __init__(self, logger: Optional[Union[str, Logger]] = None) -> None:
        self.data = {}

        if type(logger) == str:
            logger = getLogger(logger)
        self.logger = logger if logger else getLogger("main")

        self.thread = Thread(target=self.__thread_job,
                             name="ValidCodeDict Auto Cleaner")
        self.thread.start()

    def __thread_job(self):
        while True:
            try:
                key_list = tuple(filter(lambda k: time() -
                                  self.data.get(k)[1] > 600, self.data.keys()))
                for key in key_list:
                    del self.data[key]
                for _ in range(600):
                    sleep(0.1)
            except SystemExit:
                return
            except Exception as exc:
                self.logger.error(string_exception(exc))

    def valid(self, session: str, valid_code: str) -> bool:
        if session is None:
            return False
        answer = self.get(session)
        if answer is None or valid_code != answer:
            return False
        self.remove(session)
        return True

    def update(self, session: str, answer: str):
        self.data[session] = (answer, time())

    def get(self, session: str) -> Optional[str]:
        if session is None:
            return None
        result = self.data.get(session)
        if result:
            return result[0]
        return None

    def remove(self, session: str):
        if self.data.get(session):
            del self.data[session]
