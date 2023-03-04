from io import BytesIO
from random import randint
from time import time_ns

from PIL import Image, ImageDraw, ImageFont

FONT = ImageFont.truetype("Mynerve-Regular.ttf", size=36)


def random_color(l: int = 0, u: int = 255) -> tuple[int]:
    return tuple(map(lambda x: randint(l, u), range(3)))


def random_string() -> str:
    return f"{randint(10, 99)}+{randint(10, 99)}="


def gen_valid_code() -> tuple[str, BytesIO]:
    img = Image.new("RGB", (128, 42), random_color(128))
    draw = ImageDraw.Draw(img)
    answer = random_string()
    for i in range(randint(5, 10)):
        x1 = randint(0, 128)
        x2 = randint(0, 128)
        y2 = randint(0, 42)
        y1 = randint(0, 42)
        draw.line((x1, y1, x2, y2), fill=random_color(
            100, 200), width=randint(1, 5))
    for i, s in enumerate(answer):
        draw.text((20 * i, randint(-6, 6)), s, random_color(0, 128), FONT)
    io = BytesIO()
    img.save(io, format="jpeg")
    img.save("d.png")
    return answer, io


gen_valid_code()
