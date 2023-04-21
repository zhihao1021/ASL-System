from .responses import response_403

from curd import CURDSession
from models import CustomResponse, Role
from typing import Optional
from utils import permissions

from os.path import isfile

from aiofiles import open as aopen
from fastapi import APIRouter, Cookie, Form, status
from fastapi.responses import ORJSONResponse


router = APIRouter()

curd_session = CURDSession()


@router.get(
    "/",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Get the announncements."
)
async def get_announcement(raw: bool = False):
    # 檢查公告文件是否存在
    if isfile("announcements.txt"):
        # 讀取公告
        async with aopen("announcements.txt") as ann_file:
            raw_results = await ann_file.read()
            results = raw_results if raw else list(
                map(lambda s: s.strip(), raw_results.strip().split("\n")))
    else:
        # 回傳空字串
        results = "" if raw else []

    status_code = status.HTTP_200_OK
    response = CustomResponse(**{
        "status": status_code,
        "success": True,
        "data": results
    })

    return ORJSONResponse(
        response.dict(),
        status_code,
    )


@router.put(
    "/",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Update the announncements."
)
async def update_announcement(context: str = Form(None), session: Optional[str] = Cookie(None)):
    # 取得使用者身份
    login_session = await curd_session.get_by_session(session)

    # 檢查權限
    role = Role.parse_obj(login_session.role_data)
    if role.permissions & permissions.EDIT_ANNOUNCEMENT:
        # 修飾內容
        context = context.replace("\r\n", "\n").strip()

        # 寫入公告
        async with aopen("announcements.txt", mode="w") as ann_file:
            await ann_file.write(context)

        status_code = status.HTTP_200_OK
        response = CustomResponse(**{
            "status": status_code,
            "success": True,
            "data": context
        })
    else:
        # 權限不符
        status_code, response = response_403()

    return ORJSONResponse(
        response.dict(),
        status_code,
    )
