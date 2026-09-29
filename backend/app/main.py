from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.api import api_router
from app.models.career import Career
from app.seed.careers import seed_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    Base.metadata.create_all(bind=engine)

    # Auto-seed in development if database is empty
    db = SessionLocal()
    try:
        count = db.query(Career).count()
        if count == 0:
            print("Database is empty. Running initial career seed...")
            seed_database(db)
    finally:
        db.close()

    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="CareerQuest backend foundation providing structured Career Explorer and Career Details APIs.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
    lifespan=lifespan,
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include API v1 routes
app.include_router(api_router, prefix=settings.API_V1_PREFIX)


@app.get(
    "/",
    status_code=status.HTTP_200_OK,
    tags=["Health & Status"],
    summary="Root Service Status",
)
def root():
    return {
        "service": settings.PROJECT_NAME,
        "status": "online",
        "docs": "/docs",
        "api_v1": settings.API_V1_PREFIX,
    }


@app.get(
    "/health",
    status_code=status.HTTP_200_OK,
    tags=["Health & Status"],
    summary="Health Check",
)
@app.get(
    f"{settings.API_V1_PREFIX}/health",
    status_code=status.HTTP_200_OK,
    tags=["Health & Status"],
    summary="API v1 Health Check",
)
def health_check():
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "debug": settings.DEBUG,
    }
