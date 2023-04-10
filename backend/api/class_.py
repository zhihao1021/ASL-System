from .responses import response_403, response_404

from curd import CURDClass, CURDSession, CURDUser
from models import CustomResponse
from utils import permissions

from fastapi import APIRouter, Cookie, status
from fastapi.responses import ORJSONResponse


router = APIRouter()

curd_class = CURDClass()
curd_session = CURDSession()
curd_user = CURDUser()


@router.get(
    "/",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Get class list.",
)
async def get_class_list(accessible: bool = True, session: str = Cookie(None)):
    data = await curd_class.get_all()
    if accessible:
        login_session = await curd_session.get_by_session(session)
        login_user = await curd_user.get_by_sid(login_session.sid)
        if login_user.role <= permissions.TEACHER_ROLE:
            data = filter(lambda class_: class_.id == login_user.class_id, data)
    data = list(map(lambda class_: class_.dict(), data))

    status_code = status.HTTP_200_OK
    response = CustomResponse(**{
        "status": status_code,
        "success": True,
        "data": data
    })

    return ORJSONResponse(
        response.dict(),
        status_code,
        headers={"cache-control": "max-age=600"}
    )


@router.get(
    "/{class_id}",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Get class data.",
)
async def get_class(class_id: int):
    data = await curd_class.get(class_id)
    if data:
        status_code = status.HTTP_200_OK
        response = CustomResponse(**{
            "status": status_code,
            "success": True,
            "data": data.dict()
        })
    elif class_id == -1:
        status_code = status.HTTP_200_OK
        response = CustomResponse(**{
            "status": status_code,
            "success": True,
            "data": {
                "id": -1,
                "class_name": "None"
            }
        })
    else:
        status_code, response = response_404("Class")

    return ORJSONResponse(
        response.dict(),
        status_code,
        headers={"cache-control": "max-age=600"}
    )


@router.get(
    "/{class_id}/students",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Get students of class.",
)
async def get_class_students(class_id: int, session: str = Cookie(None)):
    login_session = await curd_session.get_by_session(session)
    login_user = await curd_user.get_by_sid(login_session.sid)
    if login_user.role >= permissions.TEACHER_ROLE:
        if login_user.role == permissions.TEACHER_ROLE and login_user.class_id != class_id:
            status_code, response = response_403()
        else:
            data = await curd_class.get(class_id)
            if data:
                students = await curd_user.get_by_class_id(class_id)
                students = filter(lambda student: student.role ==
                                  permissions.STUDENT_ROLE, students)
                students = list(map(lambda student: student.dict(), students))
                status_code = status.HTTP_200_OK
                response = CustomResponse(**{
                    "status": status_code,
                    "success": True,
                    "data": students
                })
            else:
                status_code, response = response_404("Class")
    else:
        status_code, response = response_403()

    return ORJSONResponse(
        response.dict(),
        status_code,
        headers={"cache-control": "max-age=600"}
    )
