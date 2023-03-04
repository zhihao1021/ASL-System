from hashlib import sha256
from base64 import b64encode
from uuid import uuid1
from typing import Union


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
