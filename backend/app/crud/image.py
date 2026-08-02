from sqlalchemy.orm import Session

from app.models.image import Image


def create_image(
    db: Session,
    original_filename: str,
    stored_filename: str,
):
    
    """
    Create a new image record.
    """

    image = Image(
        original_filename=original_filename,
        stored_filename=stored_filename,
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