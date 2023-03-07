from aiosqlmodel import AsyncSession
from config import ENGINE
from models import User
from swap import VALID_CODE_DICT
from web import gen_server

from asyncio import all_tasks, new_event_loop, run

from sqlmodel import SQLModel

DEBUG = True


async def sql_init():
    async with ENGINE.begin() as conn:
        if DEBUG:
            await conn.run_sync(SQLModel.metadata.drop_all)
        await conn.run_sync(SQLModel.metadata.create_all)

    if DEBUG:
        async with AsyncSession(ENGINE) as session:
            session.add(
                User(**{"sid": "000", "name": "admin", "account": "admin", "password": "admin"}))
            session.add(
                User(**{"sid": "001", "name": "alice", "account": "alice", "password": "alice"}))

            await session.commit()

if __name__ == "__main__":
    from platform import system
    if system() == "Windows":
        from asyncio import set_event_loop_policy, WindowsSelectorEventLoopPolicy
        set_event_loop_policy(WindowsSelectorEventLoopPolicy())
    run(sql_init())

    server = gen_server()

    loop = new_event_loop()
    app_task = loop.create_task(server.serve())
    loop.run_until_complete(app_task)

    for task in all_tasks(loop):
        task.cancel()
    loop.stop()
