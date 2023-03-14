from .responses import response_400, response_403, response_404

from curd import CURDSession, CURDUser
from models import CustomResponse
from schemas import SessionCreate
from swap import VALID_CODE_DICT
from utils import gen_session_id, gen_valid_code
from typing import Optional


from fastapi import APIRouter, Cookie, Request, Response, status
from fastapi.responses import ORJSONResponse
from pydantic import BaseModel


class LoginData(BaseModel):
    account: str
    password: str
    valid_code: str


router = APIRouter()

curd_session = CURDSession()
curd_user = CURDUser()


@router.post(
    "/auth",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Auth by account and password to get the session cookies."
)
async def auth(request: Request, data: LoginData, session: Optional[str] = Cookie(None)):
    user = await curd_user.get_by_account(data.account)

    if not VALID_CODE_DICT.valid(session, data.valid_code):
        status_code, response = response_400("Wrong Valid Code!")
    elif user is None:
        status_code, response = response_404("Account")
    elif data.password != user.password:
        status_code, response = response_403("Wrong Password!")
    else:
        if await curd_session.get_by_session(session) is None:
            session_obj = SessionCreate(**{
                "session": session,
                "sid": user.sid,
                "ip": request.client.host or "localhost"
            })
            await curd_session.create(session_obj)

        status_code = status.HTTP_200_OK
        response = CustomResponse(**{
            "status": status_code,
            "success": True,
            "data": "Auth Success!"
        })

    return ORJSONResponse(response.dict(), status_code)


@router.get(
    "/valid-code",
    description="Valid Code."
)
def valid_code(session: Optional[str] = Cookie(None)):
    answer, img_bytes = gen_valid_code()
    response = Response(content=img_bytes, headers={
                        "Cache-Control": "no-store"}, media_type="image/jpeg")
    if session is None:
        session = gen_session_id()
        response.set_cookie("session", session)
    VALID_CODE_DICT.update(session, answer)
    return response
