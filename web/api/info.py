from .responses import response_403, response_404 

from curd import CURDSession, CURDUser
from models import CustomResponse, Session
from typing import Optional
from utils import permissions

from imghdr import what
from os.path import isfile

from aiofiles import open as aopen
from fastapi import APIRouter, status, Cookie
from fastapi.responses import FileResponse, ORJSONResponse


router = APIRouter()

curd_session = CURDSession()
curd_user = CURDUser()


@router.get(
    "/user/{sid}",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Get the data of user whose sid equal to the given sid(\"current\" to query current user's)."
)
async def get_user(sid: str, session: Optional[str] = Cookie(None)):
    login_session = await curd_session.get_by_session(session)
    sid = login_session.sid if sid == "current" else sid
    login_user = await curd_user.get_by_sid(login_session.sid)

    if login_user.sid == sid or login_user.role >= permissions.TEACHER_ROLE:
        user = login_user if login_user.sid == sid else await curd_user.get_by_sid(sid)
        if user is None:
            status_code, response = response_404("User")
        else:
            status_code = status.HTTP_200_OK
            response = CustomResponse(**{
                "status": status_code,
                "success": True,
                "data": user.dict()
            })
    else:
        status_code, response = response_403()

    return ORJSONResponse(
        response.dict(),
        status_code,
    )


@router.get(
    "/user/{sid}/icon",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Get the icon of user whose sid equal to the given sid(\"current\" to query current user's)."
)
async def get_user_icon(sid: str, session: Optional[str] = Cookie(None)):
    login_session = await curd_session.get_by_session(session)
    sid = login_session.sid if sid == "current" else sid
    login_user = await curd_user.get_by_sid(login_session.sid)

    if login_user.sid == sid or login_user.role >= permissions.TEACHER_ROLE:
        user = login_user if login_user.sid == sid else await curd_user.get_by_sid(sid)
        if user is None:
            status_code, response = response_404("User")
        else:
            file_path = f"saves/{sid}/icon"
            if isfile(file_path):
                async with aopen(file_path, mode="rb") as img_file:
                    img_content = await img_file.read()
                img_type = what(None, img_content) or "jpeg"
                response = FileResponse(file_path, media_type=f"image/{img_type}")
            else:
                response = FileResponse("default_files/user_icon.png", media_type="image/png")
            return response
    else:
        status_code, response = response_403()

    return ORJSONResponse(
        response.dict(),
        status_code,
    )

@router.get(
    "/user/current/login-history",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Get the Login History of user whose sid equal to the given sid(\"current\" to query current user's)."
)
async def get_user_login_history(session: Optional[str] = Cookie(None)):
    def encode_dict(d: Session):
        result = d.dict()
        result["current"] = d.session == session
        return result
    login_session = await curd_session.get_by_session(session)
    target_sessions = await curd_session.get_by_sid(login_session.sid)

    target_sessions.sort()
    data: list[dict] = list(map(encode_dict, target_sessions))

    status_code = status.HTTP_200_OK
    response = CustomResponse(**{
        "status": status_code,
        "success": True,
        "data": data
    })

    response = ORJSONResponse(response.dict(), status_code)
    return response

