from .post_model import EncryptLoginData

from aiosqlmodel import AsyncSession, SessionData
from config import ENGINE, WEB_CONFIG
from utils import error_403, error_404, error_500
from utils import gen_session_id, open_template

from typing import Optional

from fastapi import Cookie, FastAPI
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from sqlmodel import select
from uvicorn import Config, Server

app = FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def index(session: Optional[str] = Cookie(None)):
    valid = True
    # 檢查Session是否為空
    if session == None:
        valid = False
    else:
        # 尋找Session
        query_stat = select(SessionData).filter(SessionData.session == session)

        async with AsyncSession(ENGINE) as sql_session:
            # 執行指令
            results = await sql_session.exec(query_stat)
            result = results.first()

            # 檢查結果是否存在
            if results == None:
                valid = False
            else:
                # 更新最後登入時間
                await result.update_time()

    # 檢查驗證是否通過
    if not valid:
        # 未通過驗證，重新導向至登入頁面
        session_id = gen_session_id()
        respond = RedirectResponse("/login")
        respond.set_cookie("session", session_id)
    else:
        # 通過驗證，回傳主頁
        respond = await open_template("index")

    return respond


@app.get("/login")
async def login():
    return await open_template("login")


@app.post("/api/valid")
async def api_valid(data: EncryptLoginData):
    valid_result = await data.valid()


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
