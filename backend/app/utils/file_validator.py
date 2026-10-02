from pathlib import Path

from fastapi import HTTPException, UploadFile

from app.core.config import (
    ALLOWED_EXTENSIONS,
    MAX_FILE_SIZE,
)


def validate_image(image: UploadFile):
    """
    Validate uploaded image before saving.
    """

    # Check file extension
    extension = Path(image.filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Only {', '.join(ALLOWED_EXTENSIONS)} files are allowed."
        )

    # Check file size
    image.file.seek(0, 2)      # Move to end of file
    file_size = image.file.tell()
    image.file.seek(0)         # Reset pointer

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail="File size must be less than 10 MB."
        )

    return True