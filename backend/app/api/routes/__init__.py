from fastapi import APIRouter
from app.api.routes.careers import router as careers_router
from app.api.routes.experiences import router as experiences_router
from app.api.routes.what_if import router as what_if_router
from app.api.routes.funding import router as funding_router

api_router = APIRouter()
api_router.include_router(careers_router)
api_router.include_router(experiences_router)
api_router.include_router(what_if_router)
api_router.include_router(funding_router)

