from .responses import response_403, response_404

from crud import CRUDSession
from models import CustomResponse
from urllib.parse import unquote

from fastapi import APIRouter, status, Cookie
from fastapi.responses import ORJSONResponse


router = APIRouter()

crud_session = CRUDSession()


@router.get(
    "/{session_id}",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Logout the user whose sid equal to the given sid(\"current\" to query current user's)."
)
async def logout_user(session_id: str, session: str = Cookie(None)):
    session_id = unquote(session_id)
    login_session = await crud_session.get_by_session(session)
    session_id = session if session_id == "current" else session_id
    target_session = await crud_session.get_by_session(session_id)

    if target_session:
        if login_session.sid == target_session.sid:
            await crud_session.delete(target_session.id)

            status_code = status.HTTP_200_OK
            response = CustomResponse(**{
                "status": status_code,
                "success": True,
                "data": "Logout Success!"
            })
        else:
            status_code, response = response_403()
    else:
        status_code, response = response_404("Session Cookies")

    response = ORJSONResponse(response.dict(), status_code)
    return response
