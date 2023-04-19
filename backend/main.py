from aiosqlmodel import AsyncSession
from api import api_router
from config import ENGINE, NOWTIME, WEB_CONFIG

from asyncio import all_tasks, new_event_loop, run
from copy import deepcopy
from os import getenv, getpid, makedirs
from os.path import isdir, isfile

from dotenv import load_dotenv
from fastapi import FastAPI
from sqlmodel import SQLModel
from uvicorn import Config, Server
from uvicorn.config import LOGGING_CONFIG

load_dotenv(".env")
DEBUG = getenv("DEBUG", False)
if type(DEBUG) != bool:
    DEBUG = DEBUG == "true"


async def sql_init():
    async with ENGINE.begin() as conn:
        if DEBUG:
            await conn.run_sync(SQLModel.metadata.drop_all)
        await conn.run_sync(SQLModel.metadata.create_all)

    if DEBUG:
        async with AsyncSession(ENGINE) as session:
            from models import User, Class
            from utils import permissions
            session.add(Class(class_name="01"))
            session.add(Class(class_name="02"))
            session.add(
                User(**{
                    "sid": "000",
                    "name": "admin",
                    "account": "admin",
                    "password": "admin",
                    "role": permissions.ADMIN_ROLE
                })
            )
            session.add(
                User(**{
                    "sid": "001",
                    "name": "student-1",
                    "account": "student-1",
                    "password": "student-1",
                    "role": permissions.STUDENT_ROLE,
                    "class_id": 1
                })
            )
            session.add(
                User(**{
                    "sid": "002",
                    "name": "student-2",
                    "account": "student-2",
                    "password": "student-2",
                    "role": permissions.STUDENT_ROLE,
                    "class_id": 2
                })
            )
            session.add(
                User(**{
                    "sid": "003",
                    "name": "teacher-1",
                    "account": "teacher-1",
                    "password": "teacher-1",
                    "role": permissions.TEACHER_ROLE,
                    "class_id": 1
                })
            )
            session.add(
                User(**{
                    "sid": "004",
                    "name": "teacher-2",
                    "account": "teacher-2",
                    "password": "teacher-2",
                    "role": permissions.TEACHER_ROLE,
                    "class_id": 2
                })
            )
            session.add(
                User(**{
                    "sid": "005",
                    "name": "a-1",
                    "account": "a-1",
                    "password": "a-1",
                    "role": permissions.AUX_ROLE,
                })
            )
            session.add(
                User(**{
                    "sid": "006",
                    "name": "a-2",
                    "account": "a-2",
                    "password": "a-2",
                    "role": permissions.AA_ROLE,
                })
            )

            await session.commit()

if __name__ == "__main__":
    with open("PID", mode="w") as pid_file:
        pid_file.write(str(getpid()))

    from platform import system
    if system() == "Windows":
        from asyncio import set_event_loop_policy, WindowsSelectorEventLoopPolicy
        set_event_loop_policy(WindowsSelectorEventLoopPolicy())
    run(sql_init())

    app = FastAPI()
    app.mount("/api", api_router)

    if not isdir("logs"):
        makedirs("logs")

    log_file = f"logs/uvicorn-{NOWTIME().isoformat().replace(':', '_')[:-6]}.log"
    logging_config = deepcopy(LOGGING_CONFIG)
    logging_config["formatters"]["file"] = {
        "()": "uvicorn.logging.DefaultFormatter",
        "fmt": "%(levelprefix)s %(message)s",
        "use_colors": False,
    }
    logging_config["handlers"]["file"] = {
        "class": "logging.FileHandler",
        "formatter": "file",
        "filename": log_file,
    }
    logging_config["loggers"]["uvicorn"]["handlers"].append("file")
    logging_config["loggers"]["uvicorn.access"]["handlers"].append("file")

    server_config = Config(
        app=app,
        host=WEB_CONFIG.host,
        port=WEB_CONFIG.port,
        log_config=logging_config
    )
    server = Server(server_config)

    loop = new_event_loop()
    app_task = loop.create_task(server.serve())
    loop.run_until_complete(app_task)

    for task in all_tasks(loop):
        task.cancel()
    loop.stop()
