from app.core.database import Base, engine

# Import all models here
from app.models.image import Image


def init_database():
    """
    Create all database tables.
    """
    Base.metadata.create_all(bind=engine)