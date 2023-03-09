from models import CustomResponse

from fastapi import status


def response_400(string: str) -> tuple[int, CustomResponse]:
    status_code = status.HTTP_400_BAD_REQUEST
    response = CustomResponse(**{
        "status": status_code,
        "success": False,
        "data": string
    })
    return status_code, response


def response_403(string: str = None) -> tuple[int, CustomResponse]:
    status_code = status.HTTP_403_FORBIDDEN
    response = CustomResponse(**{
        "status": status_code,
        "success": False,
        "data": string or "Permission Denied!"
    })
    return status_code, response


def response_404(string: str) -> tuple[int, CustomResponse]:
    status_code = status.HTTP_404_NOT_FOUND
    response = CustomResponse(**{
        "status": status_code,
        "success": False,
        "data": f"{string} Not Found!"
    })
    return status_code, response
