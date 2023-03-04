from .threading_ import Thread

from io import BytesIO
from random import choice, randint
from time import sleep, time
from typing import Optional

from PIL import Image, ImageDraw, ImageFont

FONTS = tuple(map(lambda i: ImageFont.truetype(
    "Mynerve-Regular.ttf", size=i), range(32, 40)))


def random_color(l: int = 0, u: int = 255) -> tuple[int]:
    return tuple(map(lambda x: randint(l, u), range(3)))


def random_string() -> str:
    return f"{randint(10, 99)}+{randint(10, 99)}="


def gen_valid_code() -> tuple[str, bytes]:
    img = Image.new("RGB", (128, 42), random_color(155))
    draw = ImageDraw.Draw(img)
    answer = random_string()
    for i in range(randint(3, 6)):
        x1, x2, x3 = map(lambda x: randint(0, 128), range(3))
        y1, y2, y3 = map(lambda x: randint(0, 42), range(3))
        draw.line((x1, y1, x2, y2), fill=random_color(), width=randint(1, 5))
        for _ in range(randint(1, 5)):
            draw.arc((x3, y3, x3 + randint(-60, 60), y3 + randint(-20, 20)),
                     randint(0, 360), randint(0, 360), random_color(), randint(1, 5))
    for i, s in enumerate(answer):
        draw.text((20 * i, randint(-6, 6)), s,
                  random_color(0, 100), choice(FONTS))
    io = BytesIO()
    img.save(io, format="jpeg")
    answer = str(eval(answer.removesuffix("=")))
    return answer, io.getvalue()


class ValidCodeDict:
    def __init__(self) -> None:
        self.data = {}

        self.thread = Thread(target=self.__thread_job,
                             name="ValidCodeDict Auto Cleaner")
        self.thread.start()

    def __thread_job(self):
        while True:
            try:
                for key in filter(lambda k: time() - self.data.get(k)[1] > 600, self.data.keys()):
                    del self.data[key]
                sleep(60)
            except SystemExit:
                return

    def valid(self, session: str, valid_code: str) -> bool:
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
