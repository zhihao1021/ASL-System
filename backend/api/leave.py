from curd import CURDLeave, CURDSession, CURDUser
from models import CustomResponse
from typing import Optional
from utils import LEAVE_TYPE, permissions

from os.path import isfile

from aiofiles import open as aopen
from fastapi import APIRouter, status, Cookie
from fastapi.responses import ORJSONResponse


router = APIRouter()

curd_leave = CURDLeave()
curd_session = CURDSession()
curd_user = CURDUser()


@router.post(
    "/",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Apply a new leave."
)
async def add_leave(session: str = Cookie(None)):
    login_session = await curd_session.get_by_session(session)


@router.get(
    "/type",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Get all type of leave."
)
async def get_type():
    status_code = status.HTTP_200_OK
    response = CustomResponse(**{
        "status": status_code,
        "success": True,
        "data": LEAVE_TYPE
    })
    
    return response.dict()
