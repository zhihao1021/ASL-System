from curd import CURDSession, CURDUser
from models import Response
from typing import Optional, Union
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
    response_model=Response,
    description="Get the data of user whose sid equal to the given sid(\"current\" to query current user's)."
)
async def get_user(sid: str, session: Optional[str] = Cookie(None)):
    login_session = await curd_session.get_by_session(session)
    sid = login_session.sid if sid == "current" else sid
    login_user = await curd_user.get_by_sid(login_session.sid)

    if login_user.sid == sid or login_user.role >= permissions.TEACHER_ROLE:
        user = login_user if login_user.sid == sid else await curd_user.get_by_sid(sid)
        if user is None:
            status_code = status.HTTP_404_NOT_FOUND
            response = Response(**{
                "status": status_code,
                "success": False,
                "data": "User Not Found!"
            })
        else:
            status_code = status.HTTP_200_OK
            response = Response(**{
                "status": status_code,
                "success": True,
                "data": user.dict()
            })
    else:
        status_code = status.HTTP_403_FORBIDDEN
        response = Response(**{
            "status": status_code,
            "success": False,
            "data": "Permission Denied!"
        })

    response = ORJSONResponse(response.dict(), status_code)
    return response


@router.get(
    "/user/{sid}/icon",
    response_class=ORJSONResponse,
    response_model=Response,
    description="Get the icon of user whose sid equal to the given sid(\"current\" to query current user's)."
)
async def get_user_icon(sid: str, session: Optional[str] = Cookie(None)):
    login_session = await curd_session.get_by_session(session)
    sid = login_session.sid if sid == "current" else sid
    login_user = await curd_user.get_by_sid(login_session.sid)

    if login_user.sid == sid or login_user.role >= permissions.TEACHER_ROLE:
        user = login_user if login_user.sid == sid else await curd_user.get_by_sid(sid)
        if user is None:
            status_code = status.HTTP_404_NOT_FOUND
            response = Response(**{
                "status": status_code,
                "success": False,
                "data": "User Not Found!"
            })
        else:
            file_path = f"saves/{sid}/icon"
            if isfile(file_path):
                async with aopen(file_path, mode="rb") as img_file:
                    img_content = await img_file.read()
                img_type = what(None, img_content) or "jpeg"
                return FileResponse(file_path, media_type=f"image/{img_type}")
            else:
                return FileResponse("default_files/user_icon.png", media_type="image/png")
    else:
        status_code = status.HTTP_403_FORBIDDEN
        response = Response(**{
            "status": status_code,
            "success": False,
            "data": "Permission Denied!"
        })

    response = ORJSONResponse(response.dict(), status_code)
    return response
