from utils import Json

from os.path import isfile

from pydantic import BaseModel
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.ext.asyncio import async_sessionmaker, AsyncSession, create_async_engine
from sqlalchemy.orm.decl_api import DeclarativeMeta


class WebConfig(BaseModel):
    host: str = "0.0.0.0"
    port: int = 8080


class SQLAlchemyConfig(BaseModel):
    url: str = "sqlite:///./data.db"
    check_same_thread: bool = False


if isfile("config.json"):
    config = Json.load_nowait("config.json")
else:
    config = {
        "web": {
            "host": "0.0.0.0",
            "port": 8080
        },
        "logging": {

        },
        "sqlalchemy": {
            "url": "sqlite:///./data.db",
            "check_same_thread": False
        }
    }

WEB_CONFIG = WebConfig(**config.get("web", {}))
SQLALCHEMY_CONFIG = SQLAlchemyConfig(**config.get("sqlalchemy", {}))

engine = create_async_engine(
    SQLALCHEMY_CONFIG.url, connect_args={
        "check_same_thread": SQLALCHEMY_CONFIG.check_same_thread}
)
class Base(DeclarativeMeta):
    pass

class Test(Base):
    __tablename__ = "test"
    account: str = Column(String, primary_key=True, unique=True, nullable=False)
    password: str = Column(String, nullable=False)


async def create_session() -> :
    Session = async_sessionmaker()
    session = Session()

    return session

Base.metadata.create_all(engine)

s = create_session()