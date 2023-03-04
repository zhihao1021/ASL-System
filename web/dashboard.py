from .api import api_router

from curd import CURDSession
from config import WEB_CONFIG
from utils import error_403, error_404, error_500, open_template

from typing import Optional

from fastapi import Cookie, FastAPI
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from uvicorn import Config, Server

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(api_router, prefix="/api")

curd_session = CURDSession()


@app.get("/")
async def index(session: Optional[str] = Cookie(None)):
    # 檢查紀錄是否存在
    obj = await curd_session.get_by_session(session)

    # 檢查驗證是否通過
    if not obj:
        # 未通過驗證，重新導向至登入頁面
        respond = RedirectResponse("/login")
    else:
        # 通過驗證，回傳主頁
        respond = await open_template("index")

    return respond


@app.get("/login")
async def login():
    return await open_template("login")


@app.exception_handler(403)
async def access_denied(requests, exc):
    return await error_403()


@app.exception_handler(404)
async def not_found(requests, exc):
    return await error_404()


@app.exception_handler(500)
async def internal_server_error(requests, exc):
    return await error_500()


def gen_server() -> Server:
    server_config = Config(
        app=app,
        host=WEB_CONFIG.host,
        port=WEB_CONFIG.port
    )
    server = Server(server_config)

    return server
