from .responses import response_403, response_404

from crud import CRUDClass, CRUDSession, CRUDUser
from models import Class, CustomResponse, Role, User
from utils import permissions

from fastapi import APIRouter, Cookie, status
from fastapi.responses import ORJSONResponse


router = APIRouter()

crud_class = CRUDClass()
crud_session = CRUDSession()
crud_user = CRUDUser()


@router.get(
    "/",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Get class list.",
)
async def get_class_list(session: str = Cookie(None)):
    # 取得使用者身份
    login_session = await crud_session.get_by_session(session)

    # 驗證權限
    role = Role.parse_obj(login_session.role_data)
    if role.permissions & permissions.READ_CLASS_LIST:
        data = await crud_class.get_all()
        data = list(map(lambda class_: class_.dict(),
                    filter(lambda c: c.class_code != -1, data)))
    else:
        user = User.parse_obj(login_session.user_data)
        data = await crud_class.get_by_class_code(user.class_code)
        data = [data.dict(),] if data.class_code != -1 else []

    status_code = status.HTTP_200_OK
    response = CustomResponse(**{
        "status": status_code,
        "success": True,
        "data": data
    })

    return ORJSONResponse(
        response.dict(),
        status_code,
    )


@router.get(
    "/{class_code}",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Get class data.",
)
async def get_class(class_code: int, session: str = Cookie(None)):
    # 取得使用者身份
    login_session = await crud_session.get_by_session(session)

    # 驗證權限
    role = Role.parse_obj(login_session.role_data)
    user = User.parse_obj(login_session.user_data)

    has_permission = role.permissions & permissions.READ_ALL_CLASS_DATA
    class_code_eq = user.class_code == class_code
    if has_permission or class_code_eq:
        data = await crud_class.get_by_class_code(class_code)
        if data:
            status_code = status.HTTP_200_OK
            response = CustomResponse(**{
                "status": status_code,
                "success": True,
                "data": data.dict()
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


@router.get(
    "/{class_code}/students",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Get students of class.",
)
async def get_class_students(class_code: int, session: str = Cookie(None)):
    # 取得使用者身份
    login_session = await crud_session.get_by_session(session)

    # 驗證權限
    role = Role.parse_obj(login_session.role_data)
    user = User.parse_obj(login_session.user_data)

    has_permission = role.permissions & permissions.READ_ALL_STUDENT_LIST
    class_code_eq = user.class_code == class_code and role.permissions & permissions.READ_SELF_STUDENT_LIST
    if has_permission or class_code_eq:
        # Student Role Code = 1
        students = await crud_user.get_by_class_code(class_code, 1)
        students = list(map(lambda student: student.dict(), students))
        status_code = status.HTTP_200_OK
        response = CustomResponse(**{
            "status": status_code,
            "success": True,
            "data": students
        })
    else:
        status_code, response = response_403()

    return ORJSONResponse(
        response.dict(),
        status_code,
        headers={"cache-control": "max-age=600"}
    )
