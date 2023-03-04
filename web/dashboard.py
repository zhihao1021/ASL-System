from .api import api_router

from curd import CURDSession
from config import WEB_CONFIG
from swap import VALID_CODE_DICT
from utils import (error_403, error_404, error_500, gen_session_id,
                   gen_valid_code, open_template)

from typing import Optional

from fastapi import Cookie, FastAPI
from fastapi.responses import RedirectResponse, Response
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
        response = RedirectResponse("/login")
        if session is None:
            session = gen_session_id()
            response.set_cookie("session", session)
    else:
        # 通過驗證，回傳主頁
        response = await open_template("index")

    return response


@app.get("/valid-code")
async def valid_code(session: Optional[str] = Cookie(None)):
    answer, img_bytes = gen_valid_code()
    response = Response(content=img_bytes, headers={
                        "Cache-Control": "no-store"}, media_type="image/jpeg")
    if session is None:
        session = gen_session_id()
        response.set_cookie("session", session)
    VALID_CODE_DICT.update(session, answer)
    return response


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
