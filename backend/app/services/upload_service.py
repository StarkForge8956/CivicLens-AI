from pathlib import Path
import shutil
import uuid

from fastapi import UploadFile

from app.core.config import UPLOAD_DIR


def save_uploaded_image(image: UploadFile):
    """
    Saves the uploaded image with a unique filename.
    """

    # Get original extension
    extension = Path(image.filename).suffix.lower()

    # Generate unique filename
    unique_filename = f"{uuid.uuid4()}{extension}"

    # Full path
    file_path = UPLOAD_DIR / unique_filename

    # Save file
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    return {
        "original_filename": image.filename,
        "stored_filename": unique_filename,
        "file_path": str(file_path)
    }