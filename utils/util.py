from hashlib import sha256
from base64 import b64encode
from uuid import uuid1
from traceback import format_exception as tformat_exception
from typing import Union
from sys import version_info


def text_encode(text: Union[str, bytes]) -> str:
    """
    將明文加密。
    """
    text = text.encode() if type(text) == str else text
    return b64encode(sha256(text).digest()).decode()


def gen_session_id() -> str:
    """
    產生Session ID。
    """
    return text_encode(uuid1().bytes)


def format_exception(exc: Exception) -> list[str]:
    if version_info.minor < 10:
        return tformat_exception(exc.__class__, exc, exc.__traceback__)
    return tformat_exception(exc)


def string_exception(exc: Exception) -> str:
    return "".join(format_exception(exc))
