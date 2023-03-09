from .login import router as login_router
from .info import router as info_router

from curd import CURDSession
from utils import error_403

from fastapi import FastAPI, Request, Response

api_router = FastAPI()
api_router.include_router(login_router, prefix="/login", tags=["login"])
api_router.include_router(info_router, prefix="/info", tags=["info"])

NEED_AUTH = (
    "/api/info",
)

curd_session = CURDSession()


@api_router.middleware("")
async def api_filter(request: Request, call_next):
    if request.url.path.startswith(NEED_AUTH):
        session = request.cookies.get("session")
        login_session = await curd_session.get_by_session(session)
        if login_session is None:
            return await error_403()
        await curd_session.update_time(login_session)

    response: Response = await call_next(request)
    if not response.headers.get("cache-control"):
        response.headers["cache-control"] = "max-age=0"

    return response
