from curd import CURDSession, CURDUser
from models import Response, User
from schemas import SessionCreate
from utils import gen_session_id


from fastapi import APIRouter, status
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
async def auth(data: LoginData):
    user = await curd_user.get_by_account(data.account)
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
    else:
        session_id = gen_session_id()
        session = SessionCreate(**{
            "session": session_id,
            "sid": user.sid
        })
        await curd_session.create(session)

        status_code = status.HTTP_200_OK
        response = Response(**{
            "status": status_code,
            "success": True,
            "data": "Auth Success!"
        })
        json_response = ORJSONResponse(response.dict(), status_code)
        json_response.set_cookie("session", session_id)
    return json_response
