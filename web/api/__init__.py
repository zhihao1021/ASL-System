from .login import router as login_router

from asyncio import sleep as asleep
from time import sleep

from fastapi import APIRouter

api_router = APIRouter()
api_router.include_router(login_router, prefix="/login", tags=["login"])


@api_router.get("/hello-world")
def hello_world():
    sleep(0.1)
    return "Hello World"


@api_router.get("/async-hello-world")
async def async_hello_world():
    await asleep(0.1)
    return "Asyc Hello World"
