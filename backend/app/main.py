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

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description=APP_DESCRIPTION,
)

app.include_router(upload_router, prefix="/api", tags=["Upload"])


@app.get("/")
def home():
    return {
        "message": "CivicLens-AI Backend Running"
    }