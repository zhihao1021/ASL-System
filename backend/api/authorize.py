from .responses import response_400, response_403, response_404

from curd import CURDLeave, CURDSession, CURDUser
from models import CustomResponse
from schemas import LeaveUpdate
from utils import permissions

from fastapi import APIRouter, Cookie, Form, status
from fastapi.responses import ORJSONResponse


router = APIRouter()

curd_leave = CURDLeave()
curd_session = CURDSession()
curd_user = CURDUser()


@router.put(
    "/accept/{leave_id}",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Apply a new leave."
)
async def accept_leave(leave_id: int, session: str = Cookie(None)):
    login_session = await curd_session.get_by_session(session)
    login_user = await curd_user.get_by_sid(login_session.sid)

    leave = await curd_leave.get(leave_id)
    leave_user = await curd_user.get_by_sid(leave.sid)

    if login_user.sid == leave_user.sid or login_user.role >= permissions.TEACHER_ROLE:
        if login_user.role == permissions.TEACHER_ROLE and login_user.class_id != leave_user.class_id:
            status_code, response = response_403()
        else:
            target_status = permissions.TEACHER_ACCEPT
            if login_user.role == permissions.TEACHER_ROLE:
                target_status = permissions.TEACHER_ACCEPT
            elif login_user.role == permissions.AUX_ROLE:
                target_status = permissions.AUX_ACCEPT
            elif login_user.role == permissions.AA_ROLE:
                target_status = permissions.AA_ACCEPT
            else:
                if leave.status == 0b0001:
                    target_status = permissions.TEACHER_ACCEPT
                elif leave.status == 0b0010:
                    target_status = permissions.AUX_ACCEPT
                elif leave.status == 0b0100:
                    target_status = permissions.AA_ACCEPT

            leave_update = LeaveUpdate(status=max(target_status, leave.status))
            leave = await curd_leave.update(leave, leave_update)

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


@router.put(
    "/reject/{leave_id}",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Apply a new leave."
)
async def reject_leave(leave_id: str, reject_reason: str = Form(""), session: str = Cookie(None)):
    login_session = await curd_session.get_by_session(session)
    login_user = await curd_user.get_by_sid(login_session.sid)

    leave = await curd_leave.get(leave_id)
    leave_user = await curd_user.get_by_sid(leave.sid)

    if login_user.sid == leave_user.sid or login_user.role >= permissions.TEACHER_ROLE:
        if login_user.role == permissions.TEACHER_ROLE and login_user.class_id != leave_user.class_id:
            status_code, response = response_403()
        else:
            target_status = permissions.TEACHER_REJECT
            if login_user.role == permissions.TEACHER_ROLE:
                target_status = permissions.TEACHER_REJECT
            elif login_user.role == permissions.AUX_ROLE:
                target_status=permissions.AUX_REJECT
            elif login_user.role == permissions.AA_ROLE:
                target_status=permissions.AA_REJECT
            else:
                if leave.status == 0b0001:
                    target_status=permissions.TEACHER_REJECT
                elif leave.status == 0b0010:
                    target_status=permissions.AUX_REJECT
                elif leave.status == 0b0100:
                    target_status=permissions.AA_REJECT
            leave_update = LeaveUpdate(
                status=max(target_status, leave.status),
                reject_reason=reject_reason
            )
            leave = await curd_leave.update(leave, leave_update)

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
