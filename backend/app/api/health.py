from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def health_check():
    return {
        "message": "Welcome to CivicLens-AI API",
        "status": "running",
        "version": "1.0.0"
    }
