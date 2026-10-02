from app.core.init_db import init_database
from app.core.config import (
    APP_NAME,
    APP_VERSION,
    APP_DESCRIPTION,
)
from fastapi import FastAPI

# Initialize the database
init_database()

from app.api.upload import router as upload_router
from app.api.detections import router as detections_router
from app.api.health import router as health_router
from app.api.reports import router as reports_router

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description=APP_DESCRIPTION,
)

app.include_router(upload_router, prefix="/api", tags=["Upload"])
app.include_router(
    detections_router,
    prefix="/api",
    tags=["Detections"],
)
app.include_router(
    reports_router,
    prefix="/api",
    tags=["Reports"],
)
app.include_router(
    health_router,
    prefix="/api/health",
    tags=["Health"],
)

@app.get("/")
def home():
    return {
        "message": "CivicLens-AI Backend Running"
    }