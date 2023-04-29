from .responses import response_403, response_404

from curd import CURDLeave, CURDSession, CURDUser
from models import CustomResponse, Role, User
from schemas import LeaveUpdate
from utils import permissions

from fastapi import APIRouter, Cookie, Form, status
from fastapi.responses import ORJSONResponse


router = APIRouter()

curd_leave = CURDLeave()
curd_session = CURDSession()
curd_user = CURDUser()

async def leave_authorize(leave_id: int, session, reject_reason: str = "", accept: bool = True) -> tuple[int, CustomResponse]:
    # 取得使用者身份
    login_session = await curd_session.get_by_session(session)
    user = User.parse_obj(login_session.user_data)

    leave = await curd_leave.get(leave_id)

    if leave:
        leave_user = await curd_user.get_by_sid(leave.sid)
        
        # 驗證權限
        role = Role.parse_obj(login_session.role_data)
        has_permission = role.permissions & permissions.READ_ALL_LEAVE_DATA
        class_code_eq = user.class_code == leave_user.class_code and role.permissions & permissions.READ_SELF_LEAVE_DATA
        if has_permission or class_code_eq:
            if accept:
                if role.late_status:
                    if leave.late_time() > (role.late_days or 0):
                        next_status = role.late_status
                    else:
                        next_status = role.accept_status
                else:
                    next_status = role.accept_status
            else:
                next_status = role.reject_status
            
            if not next_status:
                next_status = leave.status

            leave_update = LeaveUpdate(status=max(next_status, leave.status))
            if not accept:
                leave_update.reject_reason = reject_reason
            leave = await curd_leave.update(leave, leave_update)

            status_code = status.HTTP_200_OK
            response = CustomResponse(**{
                "status": status_code,
                "success": True,
                "data": leave.dict()
            })

            return status_code, response
        else:
            return response_403()
    else:
        return response_404("Leave Data")


@router.put(
    "/accept/{leave_id}",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Apply a new leave."
)
async def accept_leave(leave_id: int, session: str = Cookie(None)):
    status_code, response = await leave_authorize(
        leave_id=leave_id,
        session=session,
        accept=True,
    )

    return ORJSONResponse(
        response.dict(),
        status_code,
    )


@router.put(
    "/reject/{leave_id}",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Apply a new leave."
)
async def reject_leave(leave_id: str, reject_reason: str = Form(""), session: str = Cookie(None)):
    status_code, response = await leave_authorize(
        leave_id=leave_id,
        session=session,
        reject_reason=reject_reason,
        accept=False,
    )

    return ORJSONResponse(
        response.dict(),
        status_code,
    )
