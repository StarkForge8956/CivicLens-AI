from sqlalchemy.orm import Session

from app.models.detection import Detection


def create_detection(
    db: Session,
    image_id: int,
    class_id: int,
    class_name: str,
    confidence: float,
    x1: float,
    y1: float,
    x2: float,
    y2: float,
    severity: str | None = None,
):
    """
    Create a new detection record.
    """

    detection = Detection(
        image_id=image_id,
        class_id=class_id,
        class_name=class_name,
        confidence=confidence,
        x1=x1,
        y1=y1,
        x2=x2,
        y2=y2,
        severity=severity,
    )

    db.add(detection)
    db.commit()
    db.refresh(detection)

    return detection


def get_detections_by_image(
    db: Session,
    image_id: int,
):
    """
    Return all detections for an image.
    """

    return (
        db.query(Detection)
        .filter(Detection.image_id == image_id)
        .order_by(Detection.id)
        .all()
    )


def get_all_detections(db: Session):
    """
    Return all detections.
    """

    return db.query(Detection).order_by(Detection.id.desc()).all()