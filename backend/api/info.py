from .responses import response_403, response_404

from config import NOWTIME
from crud import CRUDSession, CRUDUser
from models import CustomResponse, Role, Session, User
from utils import permissions

from datetime import datetime

from fastapi import APIRouter, status, Cookie
from fastapi.responses import ORJSONResponse


router = APIRouter()

crud_session = CRUDSession()
crud_user = CRUDUser()


@router.get(
    "/user/{sid}",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Get the data of user whose sid equal to the given sid(\"current\" to query current user's)."
)
async def get_user(sid: str, session: str = Cookie(None)):
    # 取得使用者身份
    login_session = await crud_session.get_by_session(session)
    headers = {
        "cache-control": "max-age=0" if sid == "current" else "max-age=600"
    }

    user = User.parse_obj(login_session.user_data)
    if sid == "current" or sid == user.sid:
        status_code = status.HTTP_200_OK
        response = CustomResponse(**{
            "status": status_code,
            "success": True,
            "data": user.dict()
        })
    else:
        # 驗證權限
        role = Role.parse_obj(login_session.role_data)
        target_user = await crud_user.get_by_sid(sid)

        if target_user:
            has_permission = role.permissions & permissions.READ_ALL_STUDENT_DATA
            class_code_eq = user.class_code == target_user.class_code and role.permissions & permissions.READ_SELF_STUDENT_DATA
            if has_permission or class_code_eq:
                status_code = status.HTTP_200_OK
                response = CustomResponse(**{
                    "status": status_code,
                    "success": True,
                    "data": target_user.dict()
                })
            else:
                status_code, response = response_403()
        else:
            status_code, response = response_404("User")

    return ORJSONResponse(
        response.dict(),
        status_code,
        headers=headers
    )


@router.get(
    "/user/current/login-history",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Get the Login History of user whose sid equal to the given sid(\"current\" to query current user's)."
)
async def get_user_login_history(session: str = Cookie(None)):
    def encode_dict(d: Session):
        result = d.dict()
        result["current"] = d.session == session
        return result
    login_session = await crud_session.get_by_session(session)
    target_sessions = await crud_session.get_by_sid(login_session.sid)

    now_datetime = NOWTIME()
    target_sessions.sort(key=lambda d: (
        now_datetime - datetime.fromisoformat(d.last_login)
    ).total_seconds())
    data: list[dict] = list(map(encode_dict, target_sessions))
    data.sort(key=lambda d: 0 if d["current"] else 1)

    status_code = status.HTTP_200_OK
    response = CustomResponse(**{
        "status": status_code,
        "success": True,
        "data": data
    })

    response = ORJSONResponse(response.dict(), status_code)
    return response
