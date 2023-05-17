from .responses import response_400, response_403, response_404

from crud import CRUDRole, CRUDSession, CRUDUser
from models import CustomResponse
from schemas import SessionCreate
from swap import VALID_CODE_DICT
from utils import gen_session_id, gen_valid_code
from typing import Optional

from logging import getLogger

from fastapi import APIRouter, Cookie, Request, Response, status
from fastapi.responses import ORJSONResponse
from pydantic import BaseModel


class LoginData(BaseModel):
    account: str
    password: str
    valid_code: str


router = APIRouter()

crud_role = CRUDRole()
crud_session = CRUDSession()
crud_user = CRUDUser()

logger = getLogger("uvicorn")


@router.post(
    "/auth",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Auth by account and password to get the session cookies."
)
async def auth(request: Request, data: LoginData, session: Optional[str] = Cookie(None)):
    user = await crud_user.get_by_account(data.account)

    if not VALID_CODE_DICT.valid(session, data.valid_code):
        status_code, response = response_400("Wrong Valid Code!")
        if user:
            logger.info(f"{user.name} Login Fail! Reason: Wrong Valid Code!")
        else:
            logger.info(f"{request.client.host} Login Fail! Reason: Wrong Valid Code!")
    elif user is None:
        status_code, response = response_404("Account")
    elif data.password != user.password:
        status_code, response = response_403("Wrong Password!")
        logger.info(f"{user.name} Login Fail! Reason: Wrong Password!")
    else:
        session_obj = await crud_session.get_by_session(session)
        if session_obj is None:
            session_obj = SessionCreate(**{
                "session": session,
                "sid": user.sid,
                "ip": request.client.host or "localhost"
            })
            session_obj = await crud_session.create(session_obj)
        
        role = await crud_role.get_by_role_code(user.role)
        
        await crud_session.update(session_obj, {
            "user_data": user.dict(),
            "role_data": role.dict(),
        })

        status_code = status.HTTP_200_OK
        response = CustomResponse(**{
            "status": status_code,
            "success": True,
            "data": "Auth Success!"
        })

        logger.info(f"{request.client.host}:{request.client.port} - {user.name} Login!")

    return ORJSONResponse(response.dict(), status_code)


@router.get(
    "/valid-code",
    description="Valid Code."
)
def valid_code(session: Optional[str] = Cookie(None), scale: float=0.3):
    answer, img_bytes = gen_valid_code(scale)
    response = Response(content=img_bytes, headers={
                        "Cache-Control": "no-store"}, media_type="image/jpeg")
    if session is None:
        session = gen_session_id()
        response.set_cookie("session", session)
    VALID_CODE_DICT.update(session, answer)
    return response
