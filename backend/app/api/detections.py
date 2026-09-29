
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database_session import get_db
from app.crud.detection import (
    get_all_detections,
    get_detections_by_image,
)
from app.crud.image import get_image_by_id
from app.models.image import Image

router = APIRouter()

@router.get("/map")
def get_map_data(
    db: Session = Depends(get_db),
):
    """
    Return processed images that have valid GPS coordinates.
    """

    images = (
        db.query(Image)
        .filter(
            Image.latitude.isnot(None),
            Image.longitude.isnot(None),
        )
        .order_by(Image.id.desc())
        .all()
    )

    return [
        {
            "image_id": image.id,
            "latitude": image.latitude,
            "longitude": image.longitude,
            "address": image.address,
            "status": image.status,
            "detections": [
                {
                    "class_name": detection.class_name,
                    "confidence": detection.confidence,
                    "severity": detection.severity,
                }
                for detection in image.detections
            ],
        }
        for image in images
    ]

@router.get("/detections")
def get_detections(
    db: Session = Depends(get_db),
):
    """
    Return all detections.
    """

    return get_all_detections(db)


@router.get("/detections/{image_id}")
def get_image_detections(
    image_id: int,
    db: Session = Depends(get_db),
):
    """
    Return all detections for a specific image.
    """

    image = get_image_by_id(db, image_id)

    if image is None:
        raise HTTPException(
            status_code=404,
            detail="Image not found.",
        )

    return get_detections_by_image(db, image_id)


@router.get("/images/{image_id}/result")
def get_image_result(
    image_id: int,
    db: Session = Depends(get_db),
):
    """
    Return complete processing results for an image.
    """

    image = get_image_by_id(db, image_id)

    if image is None:
        raise HTTPException(
            status_code=404,
            detail="Image not found.",
        )

    detections = get_detections_by_image(
        db,
        image_id,
    )

    return {
        "image_id": image.id,
        "filename": image.original_filename,
        "stored_filename": image.stored_filename,
        "upload_time": image.upload_time,
        "status": image.status,

        "location": {
            "latitude": image.latitude,
            "longitude": image.longitude,
            "address": image.address,
        },

        "detections": [
            {
                "id": detection.id,
                "class_id": detection.class_id,
                "class_name": detection.class_name,
                "confidence": detection.confidence,
                "severity": detection.severity,
                "bbox": {
                    "x1": detection.x1,
                    "y1": detection.y1,
                    "x2": detection.x2,
                    "y2": detection.y2,
                },
            }
            for detection in detections
        ],
    }
