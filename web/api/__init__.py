from .login import router as login_router

from fastapi import APIRouter

api_router = APIRouter()
api_router.include_router(login_router, prefix="/login", tags=["login"])