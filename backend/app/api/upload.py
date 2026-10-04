import os
from pathlib import Path

from fastapi import APIRouter, Body, UploadFile, File, Depends, HTTPException, Form
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
from app.core.config import UPLOAD_DIR
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

    severity_rank = {
        "Low": 1,
        "Medium": 2,
        "High": 3,
    }

    results = []

    for image in images:
        detections = [
            {
                "id": detection.id,
                "class_name": detection.class_name,
                "confidence": detection.confidence,
                "severity": detection.severity,
            }
            for detection in image.detections
        ]

        overall_severity = "Low"

        if detections:
            overall_severity = max(
                detections,
                key=lambda detection:
                severity_rank.get(
                    detection["severity"],
                    0,
                ),
            )["severity"]

        results.append(
            {
                "image_id": image.id,
                "filename": image.original_filename,
                "stored_filename": image.stored_filename,
                "upload_time": image.upload_time,
                "date": (
                    image.upload_time.strftime(
                        "%d %b %Y, %I:%M %p"
                    )
                    if image.upload_time
                    else None
                ),
                "status": image.status,
                "severity": overall_severity,
                "location": {
                    "latitude": image.latitude,
                    "longitude": image.longitude,
                    "address": image.address,
                },
                "detection_count": len(detections),
                "detections": detections,
            }
        )

    return results
@router.delete("/images/bulk")
def delete_multiple_images(
    image_ids: list[int] = Body(...),
    db: Session = Depends(get_db),
):
    deleted_ids = []

    for image_id in image_ids:
        image = get_image_by_id(db, image_id)

        if image is None:
            continue

        original_path = UPLOAD_DIR / image.stored_filename

        annotated_path = UPLOAD_DIR / (
            f"{Path(image.stored_filename).stem}_annotated.jpg"
        )

        for file_path in [
            original_path,
            annotated_path,
        ]:
            if file_path.exists():
                file_path.unlink()

        delete_image(db, image)
        deleted_ids.append(image_id)

    return {
        "message": "Selected images deleted successfully.",
        "deleted_ids": deleted_ids,
    }

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

    original_path = UPLOAD_DIR / image.stored_filename

    annotated_path = UPLOAD_DIR / (
        f"{Path(image.stored_filename).stem}_annotated.jpg"
    )

    for file_path in [
        original_path,
        annotated_path,
    ]:
        if file_path.exists():
            file_path.unlink()

    delete_image(db, image)

    return {
        "message": "Image and associated data deleted successfully.",
        "image_id": image_id,
    }
