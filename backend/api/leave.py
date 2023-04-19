from .responses import response_400, response_403, response_404

from curd import CURDLeave, CURDSession, CURDUser
from models import CustomResponse
from schemas import LeaveCreate
from utils import format_exception, LEAVE_TYPE, LESSON, permissions

from asyncio import create_task, gather
from datetime import date, datetime
from imghdr import what
from io import BytesIO
from os import listdir, makedirs, remove, removedirs
from os.path import isdir, join, splitext

from aiofiles import open as aopen
from fastapi import APIRouter, Cookie, File, Form, status, UploadFile
from fastapi.responses import FileResponse, ORJSONResponse, Response
from openpyxl import Workbook


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
    "/id/{leave_id}",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Get the leave by id."
)
async def get_leave_by_id(leave_id: int, session: str = Cookie(None)):
    login_session = await curd_session.get_by_session(session)
    login_user = await curd_user.get_by_sid(login_session.sid)
    leave = await curd_leave.get(leave_id)
    leave_user = await curd_user.get_by_sid(leave.sid)

    if login_user.sid == leave_user.sid or login_user.role >= permissions.TEACHER_ROLE:
        if login_user.role == permissions.TEACHER_ROLE and login_user.class_id != leave_user.class_id:
            status_code, response = response_403()
        else:
            status_code = status.HTTP_200_OK
            response = CustomResponse(**{
                "status": status_code,
                "success": True,
                "data": leave.dict()
            })
    else:
        status_code, response = response_403()

    return ORJSONResponse(
        response.dict(),
        status_code,
    )


@router.delete(
    "/id/{leave_id}",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Delete the leave."
)
async def delete_leave(leave_id: int, session: str = Cookie(None)):
    login_session = await curd_session.get_by_session(session)
    leave = await curd_leave.get(leave_id)

    if leave.status == 0b1000:
        status_code, response = response_400("Finished Data Can't Delete.")
    elif leave is None:
        status_code, response = response_404("Data")
    elif leave.sid == login_session.sid:
        await curd_leave.delete(leave_id)

        files_path = f"saves/leave/{leave.id}"
        if isdir(files_path):
            for file in listdir(files_path):
                try:
                    remove(join(files_path, file))
                except:
                    pass
            try:
                removedirs(files_path)
            except:
                pass

        return Response(status_code=status.HTTP_204_NO_CONTENT)
    else:
        status_code, response = response_403()

    return ORJSONResponse(
        response.dict(),
        status_code
    )


@router.get(
    "/id/{leave_id}/{file_id}",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Get the leave file by id."
)
async def get_leave_file(leave_id: int, file_id: int, session: str = Cookie(None)):
    login_session = await curd_session.get_by_session(session)
    login_user = await curd_user.get_by_sid(login_session.sid)
    leave = await curd_leave.get(leave_id)
    leave_user = await curd_user.get_by_sid(leave.sid)

    if login_user.sid == leave_user.sid or login_user.role >= permissions.TEACHER_ROLE:
        if login_user.role == permissions.TEACHER_ROLE and login_user.class_id != leave_user.class_id:
            status_code, response = response_403()
        else:
            dir_path = f"saves/leave/{leave.id}"
            files = listdir(dir_path)
            try:
                file_path = join(dir_path, files[file_id])
                async with aopen(file_path, mode="rb") as img_file:
                    img_content = await img_file.read(32)
                img_type = what(None, img_content) or "jpeg"
                return FileResponse(file_path, media_type=f"image/{img_type}")
            except IndexError:
                status_code, response = response_404("File")
    else:
        status_code, response = response_403()

    return ORJSONResponse(
        response.dict(),
        status_code,
        headers={"cache-control": "max-age=600"}
    )


@router.get(
    "/sid/{sid}",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Get the leave by sid(\"current\" to query current user's)."
)
async def get_leave_by_sid(sid: str, page: int = 0, session: str = Cookie(None)):
    login_session = await curd_session.get_by_session(session)
    sid = login_session.sid if sid == "current" else sid
    login_user = await curd_user.get_by_sid(login_session.sid)
    leaves = await curd_leave.get_by_sid(sid, page)
    leave_user = await curd_user.get_by_sid(sid)

    if login_user.sid == leave_user.sid or login_user.role >= permissions.TEACHER_ROLE:
        if login_user.role == permissions.TEACHER_ROLE and login_user.class_id != leave_user.class_id:
            status_code, response = response_403()
        else:
            # leaves.sort(key=lambda leave: datetime.fromisoformat(
            #     leave.create_time), reverse=True)

            status_code = status.HTTP_200_OK
            response = CustomResponse(**{
                "status": status_code,
                "success": True,
                "data": list(map(
                    lambda data: data.dict(),
                    leaves
                ))
            })
    else:
        status_code, response = response_403()

    return ORJSONResponse(
        response.dict(),
        status_code,
    )


@router.get(
    "/sid/{sid}/export",
    description="Get the leave excel sheet by sid."
)
async def export_leave_by_sid(sid: str, session: str = Cookie(None)):
    login_session = await curd_session.get_by_session(session)
    login_user = await curd_user.get_by_sid(login_session.sid)
    leaves = await curd_leave.get_by_sid(sid, -1)
    leave_user = await curd_user.get_by_sid(sid)

    if login_user.sid == leave_user.sid or login_user.role >= permissions.TEACHER_ROLE:
        if login_user.role == permissions.TEACHER_ROLE and login_user.class_id != leave_user.class_id:
            status_code, response = response_403()
        else:
            def export() -> BytesIO:
                SORT_MAP = [
                    "id",
                    "create_time",
                    "sid",
                    "type",
                    "status",
                    "start_date",
                    "start_lesson",
                    "end_date",
                    "end_lesson",
                    "remark",
                    "reject_reason",
                    "files"
                ]
                STATUS_MAP = {
                    0b0001: "送出",
                    0b0010: "導師核准",
                    0b0100: "教官核准",
                    0b1000: "學務主任核准(完成)",
                    0b10010: "導師拒絕",
                    0b10100: "教官拒絕",
                    0b11000: "學務主任拒絕",
                }
                wb = Workbook()
                ws = wb.active
                ws.append([
                    "ID",
                    "建立時間",
                    "學號",
                    "假別",
                    "狀態",
                    "開始日期",
                    "開始節次",
                    "結束日期",
                    "結束節次",
                    "備註",
                    "拒絕原因",
                ])
                for leave in leaves:
                    raw_data = leave.dict()
                    raw_data["type"] = LEAVE_TYPE[raw_data["type"]]
                    raw_data["status"] = STATUS_MAP[raw_data["status"]]
                    raw_data["start_lesson"] = LESSON[raw_data["start_lesson"]]
                    raw_data["end_lesson"] = LESSON[raw_data["end_lesson"]]
                    data = list(raw_data.items())
                    data.sort(key=lambda t: SORT_MAP.index(t[0]))
                    values = tuple(map(lambda t: t[1], data[:-1]))
                    ws.append(values)
                io = BytesIO()
                wb.save(io)
                io.seek(0)

                return io
            
            return Response(content=export().read(), headers={"Content-Disposition": "attachment; filename=export.xlsx"})
    else:
        status_code, response = response_403()

    return ORJSONResponse(
        response.dict(),
        status_code,
    )


@router.get(
    "/status/{status_}",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Get the leave by status(for authorize)."
)
async def get_leave_by_status(status_: int, session: str = Cookie(None)):
    login_session = await curd_session.get_by_session(session)
    login_user = await curd_user.get_by_sid(login_session.sid)

    if status_ == 0:
        if login_user.role == permissions.TEACHER_ROLE:
            status_ = 0b0001
        elif login_user.role == permissions.AUX_ROLE:
            status_ = 0b0010
        elif login_user.role == permissions.AA_ROLE:
            status_ = 0b0100

    if login_user.role >= permissions.TEACHER_ROLE:
        leaves = await curd_leave.get_by_status(status_)
        if login_user.role == permissions.TEACHER_ROLE:
            students = await curd_user.get_by_class_id(login_user.class_id)
            student_sids = tuple(map(lambda student: student.sid, students))
            leaves = list(
                filter(lambda leave: leave.sid in student_sids, leaves))
        status_code = status.HTTP_200_OK
        response = CustomResponse(**{
            "status": status_code,
            "success": True,
            "data": list(map(
                lambda data: data.dict(),
                leaves
            ))
        })
    else:
        status_code, response = response_403()

    return ORJSONResponse(
        response.dict(),
        status_code,
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
