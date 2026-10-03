import os
from pathlib import Path

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Form
from sqlalchemy.orm import Session

from app.core.database_session import get_db
from app.crud.image import (
    create_image,
    get_all_images,
    get_image_by_id,
    delete_image,
)
from app.crud.detection import create_detection
from app.services.upload_service import save_uploaded_image
from app.services.ai_service import AIService
from app.services.severity_service import calculate_severity
from app.utils.file_validator import validate_image


router = APIRouter()

ai_service = AIService()


@router.post("/upload")
async def upload_image(
    image: UploadFile = File(...),
    latitude: float | None = Form(None),
    longitude: float | None = Form(None),
    address: str | None = Form(None),
    db: Session = Depends(get_db),
):
    """
    Upload an image, run AI detection, and save detections.
    """

    # Validate uploaded image
    validate_image(image)

    # Save image
    result = save_uploaded_image(image)

    # Create image database record
    image_record = create_image(
        db=db,
        original_filename=result["original_filename"],
        stored_filename=result["stored_filename"],
        latitude=latitude,
        longitude=longitude,
        address=address,
    )

    # Run AI inference
    detections = ai_service.predict(
        result["file_path"]
    )

        # Save detections to database
    for detection in detections:
        bbox = detection["bbox"]

        severity = calculate_severity(
            class_name=detection["class_name"],
            confidence=detection["confidence"],
            bbox=bbox,
        )

        detection["severity"] = severity

        saved_detection = create_detection(
            db=db,
            image_id=image_record.id,
            class_id=detection["class_id"],
            class_name=detection["class_name"],
            confidence=detection["confidence"],
            x1=bbox["x1"],
            y1=bbox["y1"],
            x2=bbox["x2"],
            y2=bbox["y2"],
            severity=severity,
        )

        detection["id"] = saved_detection.id

    # Update image status
    image_record.status = "Processed"
    db.commit()

    # Get annotated image filename
    annotated_filename = (
        Path(result["file_path"]).stem + "_annotated.jpg"
    )

    return {
        "status": "success",
        "message": "Image uploaded and processed successfully.",
        "image_id": image_record.id,
        "original_filename": result["original_filename"],
        "stored_filename": result["stored_filename"],
        "annotated_filename": annotated_filename,
        "annotated_url": f"/uploads/{annotated_filename}",
        "file_path": result["file_path"],
        "latitude": latitude,
        "longitude": longitude,
        "address": address,
        "detections": detections,
    }


@router.get("/images")
def get_images(
    db: Session = Depends(get_db),
):
    images = get_all_images(db)

    return [
        {
            "image_id": image.id,
            "filename": image.original_filename,
            "upload_time": image.upload_time,
            "status": image.status,
            "location": {
                "latitude": image.latitude,
                "longitude": image.longitude,
                "address": image.address,
            },
            "detection_count": len(image.detections),
            "detections": [
                {
                    "id": detection.id,
                    "class_name": detection.class_name,
                    "confidence": detection.confidence,
                    "severity": detection.severity,
                }
                for detection in image.detections
            ],
        }
        for image in images
    ]


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

    file_path = os.path.join(
        "uploads",
        image.stored_filename,
    )

    if os.path.exists(file_path):
        os.remove(file_path)

    delete_image(db, image)

    return {
        "message": "Image deleted successfully."
    }