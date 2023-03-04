from curd import CURDSession, CURDUser
from models import Response, User
from schemas import SessionCreate
from swap import VALID_CODE_DICT
from typing import Optional
from utils import gen_session_id


from fastapi import APIRouter, status, Cookie
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
    response_model=Response,
)
async def auth(data: LoginData, session: Optional[str] = Cookie(None)):
    user = await curd_user.get_by_account(data.account)
    if session is None:
        session = gen_session_id()
    print(data, VALID_CODE_DICT.get(session))
    if user == None:
        status_code = status.HTTP_404_NOT_FOUND
        response = Response(**{
            "status": status_code,
            "success": False,
            "data": "Account Not Found!"
        })
    elif data.password != user.password:
        status_code = status.HTTP_403_FORBIDDEN
        response = Response(**{
            "status": status_code,
            "success": False,
            "data": "Wrong Password!"
        })
    elif not VALID_CODE_DICT.valid(session, data.valid_code):
        status_code = status.HTTP_400_BAD_REQUEST
        response = Response(**{
            "status": status_code,
            "success": False,
            "data": "Wrong Valid Code!"
        })
    else:
        session = gen_session_id()
        session = SessionCreate(**{
            "session": session,
            "sid": user.sid
        })
        await curd_session.create(session)

        status_code = status.HTTP_200_OK
        response = Response(**{
            "status": status_code,
            "success": True,
            "data": "Auth Success!"
        })
    response = ORJSONResponse(response.dict(), status_code)
    response.set_cookie("session", session)
    return response
