from app.core.database import Base, engine

# Import all models here
from app.models.image import Image
from app.models.detection import Detection


def init_database():
    """
    Create all database tables.
    """
    Base.metadata.create_all(bind=engine)