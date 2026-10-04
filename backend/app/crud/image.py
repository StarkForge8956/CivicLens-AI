from sqlalchemy.orm import Session

from app.models.image import Image
from app.models.detection import Detection
from app.models.incident_report import IncidentReport


def create_image(
    db: Session,
    original_filename: str,
    stored_filename: str,
    latitude: float | None = None,
    longitude: float | None = None,
    address: str | None = None,
):
    """
    Create a new image record with optional location metadata.
    """

    image = Image(
        original_filename=original_filename,
        stored_filename=stored_filename,
        latitude=latitude,
        longitude=longitude,
        address=address,
    )

    db.add(image)
    db.commit()
    db.refresh(image)

    return image


def get_all_images(db: Session):
    """
    Return all uploaded images.
    """
    return db.query(Image).order_by(Image.id.desc()).all()


def get_image_by_id(db: Session, image_id: int):
    """
    Return a single image by ID.
    """
    return db.query(Image).filter(Image.id == image_id).first()


def delete_image(db: Session, image: Image):
    """
    Delete an image and all associated detections
    and incident reports.
    """

    detections = (
        db.query(Detection)
        .filter(Detection.image_id == image.id)
        .all()
    )

    detection_ids = [
        detection.id
        for detection in detections
    ]

    if detection_ids:
        db.query(IncidentReport).filter(
            IncidentReport.detection_id.in_(detection_ids)
        ).delete(
            synchronize_session=False
        )

    db.query(Detection).filter(
        Detection.image_id == image.id
    ).delete(
        synchronize_session=False
    )

    db.delete(image)
    db.commit()