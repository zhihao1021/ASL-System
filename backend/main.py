from aiosqlmodel import AsyncSession
from api import api_router
from config import WEB_CONFIG
from config import ENGINE

from asyncio import all_tasks, new_event_loop, run
from os.path import isfile

from fastapi import FastAPI
from sqlmodel import SQLModel
from uvicorn import Config, Server

DEBUG = isfile("DEBUG")


async def sql_init():
    async with ENGINE.begin() as conn:
        if DEBUG:
            await conn.run_sync(SQLModel.metadata.drop_all)
        await conn.run_sync(SQLModel.metadata.create_all)

    if DEBUG:
        async with AsyncSession(ENGINE) as session:
            from models import User
            from utils import permissions
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
                    "name": "alice",
                    "account": "alice",
                    "password": "alice",
                    "role": permissions.STUDENT_ROLE
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
