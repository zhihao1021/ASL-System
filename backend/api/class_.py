from curd import CURDClass
from models import CustomResponse

from fastapi import APIRouter, status
from fastapi.responses import ORJSONResponse


router = APIRouter()

curd_class = CURDClass()


@router.get(
    "/{class_id}",
    response_class=ORJSONResponse,
    response_model=CustomResponse,
    description="Get class data.",
)
async def get_class(class_id: int):
    data = await curd_class.get(class_id)
    if data:
        status_code = status.HTTP_200_OK
        response = CustomResponse(**{
            "status": status_code,
            "success": True,
            "data": data.dict()
        })
    else:
        status_code = status.HTTP_404_NOT_FOUND
        response = CustomResponse(**{
            "status": status_code,
            "success": False,
            "data": None
        })

    return ORJSONResponse(response.dict(), status_code)
