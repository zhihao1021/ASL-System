from utils import Json

from asyncio import run
from datetime import datetime, timedelta, timezone
from os.path import isfile

from pydantic import BaseModel
from sqlalchemy.ext.asyncio import create_async_engine


class WebConfig(BaseModel):
    host: str = "0.0.0.0"
    port: int = 8081


class SQLAlchemyConfig(BaseModel):
    url: str = "sqlite+aiosqlite:///data.db"
    check_same_thread: bool = False


if isfile("config.json"):
    config = Json.load_nowait("config.json")
else:
    config = {
        "web": {
            "host": "0.0.0.0",
            "port": 8081
        },
        "logging": {

        },
        "sqlalchemy": {
            "url": "sqlite+aiosqlite:///data.db",
            "check_same_thread": False
        },
        "timezone": 8,
    }

WEB_CONFIG = WebConfig(**config.get("web", {}))
SQLALCHEMY_CONFIG = SQLAlchemyConfig(**config.get("sqlalchemy", {}))

ENGINE = create_async_engine(
    SQLALCHEMY_CONFIG.url,
    connect_args={
        "check_same_thread": SQLALCHEMY_CONFIG.check_same_thread,
    },
)

TIMEZONE = timezone(timedelta(hours=config.get("timezone", 8)))
def NOWTIME(): return datetime.now(TIMEZONE)
