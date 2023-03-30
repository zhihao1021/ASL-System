from .responses import response_403, response_404

from curd import CURDLeave, CURDSession, CURDUser
from models import CustomResponse, Leave
from schemas import LeaveCreate
from typing import Optional
from utils import format_exception, LEAVE_TYPE, LESSON, permissions

from asyncio import create_task, gather
from datetime import date
from os import makedirs
from os.path import isdir, join, splitext

from aiofiles import open as aopen
from fastapi import APIRouter, Cookie, File, Form, status, UploadFile
from fastapi.responses import ORJSONResponse


router = APIRouter()

curd_leave = CURDLeave()
curd_session = CURDSession()
curd_user = CURDUser()


@router.post(
    "/",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Apply a new leave."
)
async def add_leave(
    leave_type: int = Form(),
    start_date: str = Form(),
    end_date: str = Form(),
    start_lesson: int = Form(),
    end_lesson: int = Form(),
    files: list[UploadFile] = File(None),
    remark: str = Form(""),
    session: str = Cookie(None)
):
    async def write_file(index: int, file: UploadFile, dir_path: str):
        sub_filename = splitext(file.filename)[1]
        async with aopen(join(dir_path, f"{index}{sub_filename}"), mode="wb") as write_file:
            await write_file.write(await file.read())

    login_session = await curd_session.get_by_session(session)

    try:
        files = list(filter(lambda file: file.size <=
                     10000000 and file.content_type.startswith("image/"), files or []))

        start_date = date.fromisoformat(start_date)
        end_date = date.fromisoformat(end_date)
        if end_date < start_date:
            raise ValueError
        elif end_date == start_date:
            if end_lesson < start_lesson:
                raise ValueError

        leave = LeaveCreate(**{
            "sid": login_session.sid,
            "type": leave_type,
            "start_date": start_date,
            "end_date": end_date,
            "start_lesson": start_lesson,
            "end_lesson": end_lesson,
            "remark": remark,
            "files": len(files)
        })
        leave = await curd_leave.create(leave)

        if files:
            files_path = f"saves/leave/{leave.id}"
            if not isdir(files_path):
                makedirs(files_path)
            tasks = [
                create_task(write_file(index, file, files_path))
                for index, file in enumerate(files[:3])
            ]
            await gather(*tasks)

        status_code = status.HTTP_201_CREATED
        response = CustomResponse(**{
            "status": status_code,
            "success": True,
            "data": ""
        })
    except Exception as exc:
        error_message = "".join(format_exception(exc))
        status_code = status.HTTP_400_BAD_REQUEST
        response = CustomResponse(**{
            "status": status_code,
            "success": False,
            "data": error_message
        })
    return ORJSONResponse(response.dict(), status_code)


@router.get(
    "/",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Get the leave of current user."
)
async def get_leave(session: str = Cookie(None)):
    login_session = await curd_session.get_by_session(session)
    leaves = await curd_leave.get_by_sid(login_session.sid)

    response = CustomResponse(**{
        "status": status.HTTP_200_OK,
        "success": True,
        "data": list(map(
            lambda data: data.dict(),
            leaves
        ))
    })

    return response.dict()


@router.delete(
    "/{leave_id}",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Delete then leave."
)
async def delete_leave(leave_id: int, session: str = Cookie(None)):
    login_session = await curd_session.get_by_session(session)
    leave = await curd_leave.get(leave_id)

    if leave is None:
        status_code, response = response_404()
    elif leave.sid == login_session.sid:
        await curd_leave.delete(leave_id)

        status_code = status.HTTP_204_NO_CONTENT
        response = CustomResponse(**{
            "status": status_code,
            "success": True,
            "data": ""
        })
    else:
        status_code, response = response_403()

    return ORJSONResponse(
        response.dict(),
        status_code
    )


@router.get(
    "/type",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Get all type of leave."
)
def get_type():
    status_code = status.HTTP_200_OK
    response = CustomResponse(**{
        "status": status_code,
        "success": True,
        "data": LEAVE_TYPE
    })

    return response.dict()


@router.get(
    "/lesson",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Get lesson list."
)
def get_lesson():
    status_code = status.HTTP_200_OK
    response = CustomResponse(**{
        "status": status_code,
        "success": True,
        "data": LESSON
    })

    return response.dict()
