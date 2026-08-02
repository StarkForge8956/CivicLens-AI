import os

from app.crud.image import (
    create_image,
    get_all_images,
    get_image_by_id,
    delete_image,
)

from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.database_session import get_db
from app.crud.image import create_image

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends,
    HTTPException,
)

from app.services.upload_service import save_uploaded_image
from app.utils.file_validator import validate_image

router = APIRouter()


@router.post("/upload")
async def upload_image(
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Upload an image after validation.
    """

    # Validate uploaded image
    validate_image(image)

    # Save image
    result = save_uploaded_image(image)
    create_image(
    db=db,
    original_filename=result["original_filename"],
    stored_filename=result["stored_filename"],
)

    return {
    "status": "success",
    "message": "Image uploaded successfully.",
    "original_filename": result["original_filename"],
    "stored_filename": result["stored_filename"],
    "file_path": result["file_path"]
}
@router.get("/images")
def get_images(
    db: Session = Depends(get_db),
):
    images = get_all_images(db)

    return images

@router.get("/images/{image_id}")
def get_image(
    image_id: int,
    db: Session = Depends(get_db),
):
    image = get_image_by_id(db, image_id)

    if image is None:
        raise HTTPException(
            status_code=404,
            detail="Image not found.",
        )

    return image

@router.delete("/images/{image_id}")
def delete_uploaded_image(
    image_id: int,
    db: Session = Depends(get_db),
):
    image = get_image_by_id(db, image_id)

    if image is None:
        raise HTTPException(
            status_code=404,
            detail="Image not found.",
        )

    file_path = os.path.join("uploads", image.stored_filename)

    if os.path.exists(file_path):
        os.remove(file_path)

    delete_image(db, image)

    return {
        "message": "Image deleted successfully."
    }