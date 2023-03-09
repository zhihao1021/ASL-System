from .api import api_router

from curd import CURDSession
from config import WEB_CONFIG
from swap import VALID_CODE_DICT
from urllib.parse import urlparse
from utils import (error_403, error_404, error_500, gen_session_id,
                   gen_valid_code, Json, open_template)

from typing import Optional

from fastapi import Cookie, FastAPI
from fastapi.responses import RedirectResponse, Response
from fastapi.staticfiles import StaticFiles
from uvicorn import Config, Server

OFFLINE = True
SCRIPTS_MAP: dict[str, dict[str, str]] = Json.load_nowait("scripts_map.json")

app = FastAPI()
app.mount("/api", api_router)
app.mount("/static", StaticFiles(directory="static"), name="static")
if OFFLINE:
    app.mount("/node_modules", StaticFiles(directory="node_modules"),
              name="node_modules")

curd_session = CURDSession()


@app.get("/")
async def index(session: Optional[str] = Cookie(None)):
    # 檢查紀錄是否存在
    login_session = await curd_session.get_by_session(session)

    # 檢查驗證是否通過
    if not login_session:
        # 未通過驗證，回傳登入頁面
        response = await open_template("login")
        if session is None:
            session = gen_session_id()
            response.set_cookie("session", session)
    else:
        # 更新最後登入時間
        await curd_session.update_time(login_session)
        # 通過驗證，回傳主頁
        response = await open_template("index")
    response.headers["cache-control"] = "max-age=0"

    return response


@app.get("/favicon.ico")
def favicon():
    return RedirectResponse("/static/img/favicon.ico", headers={"cache-control": "max-age=315360000"})


@app.get("/valid-code")
def valid_code(session: Optional[str] = Cookie(None)):
    answer, img_bytes = gen_valid_code()
    response = Response(content=img_bytes, headers={
                        "Cache-Control": "no-store"}, media_type="image/jpeg")
    if session is None:
        session = gen_session_id()
        response.set_cookie("session", session)
    VALID_CODE_DICT.update(session, answer)
    return response


@app.get("/scripts/{filename}")
def scripts(filename: str):
    data = SCRIPTS_MAP.get(filename)
    if not data:
        return Response(status_code=404)

    return RedirectResponse(
        data.get("local") if OFFLINE else data.get("cdn"),
        headers={"cache-control": "max-age=315360000"}
    )


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
