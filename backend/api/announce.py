from curd import CURDSession, CURDUser
from models import CustomResponse
from typing import Optional
from utils import permissions

from os.path import isfile

from aiofiles import open as aopen
from fastapi import APIRouter, Cookie, Form, status
from fastapi.responses import ORJSONResponse


router = APIRouter()

curd_session = CURDSession()
curd_user = CURDUser()


@router.get(
    "/",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Get the announncements."
)
async def get_announcement(raw: bool=False):
    if isfile("announcements.txt"):
        async with aopen("announcements.txt") as ann_file:
            raw_results = await ann_file.read()
            if raw:
                results = raw_results
            else:
                results = raw_results.strip().split("\n")
                results = list(map(lambda s: s.strip(), results))
    else:
        results = "" if raw else []
    status_code = status.HTTP_200_OK
    response = CustomResponse(**{
        "status": status_code,
        "success": True,
        "data": results
    })
    return response

@router.put(
    "/",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Update the announncements."
)
async def update_announcement(context: str = Form(None), session: Optional[str] = Cookie(None)):
    login_session = await curd_session.get_by_session(session)
    login_user = await curd_user.get_by_sid(login_session.sid)
    if login_user.role >= permissions.GS_ROLE:
        context = context.replace("\r\n", "\n").strip()
        async with aopen("announcements.txt", mode="w") as ann_file:
            await ann_file.write(context)
        status_code = status.HTTP_200_OK
        response = CustomResponse(**{
            "status": status_code,
            "success": True,
            "data": context
        })
    else:
        status_code = status.HTTP_403_FORBIDDEN
        response = CustomResponse(**{
            "status": status_code,
            "success": False,
            "data": ""
        })
    
    return ORJSONResponse(
        response.dict(),
        status_code,
    )
