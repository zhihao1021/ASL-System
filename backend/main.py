from aiosqlmodel import AsyncSession
from api import api_router
from config import WEB_CONFIG
from config import ENGINE

from asyncio import all_tasks, new_event_loop, run
from os import getenv

from dotenv import load_dotenv
from fastapi import FastAPI
from sqlmodel import SQLModel
from uvicorn import Config, Server

load_dotenv(".env")
DEBUG = getenv("DEBUG", False) == "true"


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
    from platform import system
    if system() == "Windows":
        from asyncio import set_event_loop_policy, WindowsSelectorEventLoopPolicy
        set_event_loop_policy(WindowsSelectorEventLoopPolicy())
    run(sql_init())

    app = FastAPI()
    app.mount("/api", api_router)
    server_config = Config(
        app=app,
        host=WEB_CONFIG.host,
        port=WEB_CONFIG.port,
    )
    server = Server(server_config)

    loop = new_event_loop()
    app_task = loop.create_task(server.serve())
    loop.run_until_complete(app_task)

    for task in all_tasks(loop):
        task.cancel()
    loop.stop()
