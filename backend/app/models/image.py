from datetime import datetime

from sqlalchemy import Column, DateTime, Float, Integer, String

from app.core.database import Base


class Image(Base):
    __tablename__ = "images"

    id = Column(Integer, primary_key=True, index=True)

    original_filename = Column(String, nullable=False)

    stored_filename = Column(String, nullable=False, unique=True)

    upload_time = Column(DateTime, default=datetime.utcnow)

    status = Column(String, default="Pending")

    # Optional location metadata
    latitude = Column(Float, nullable=True)

    longitude = Column(Float, nullable=True)

    address = Column(String, nullable=True)