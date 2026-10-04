from datetime import datetime
from zoneinfo import ZoneInfo

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String

from app.core.database import Base


class IncidentReport(Base):
    __tablename__ = "incident_reports"

    id = Column(Integer, primary_key=True, index=True)

    report_number = Column(
        String,
        unique=True,
        nullable=False,
    )

    detection_id = Column(
        Integer,
        ForeignKey("detections.id"),
        nullable=False,
    )

    status = Column(
        String,
        default="Draft",
        nullable=False,
    )

    authority_name = Column(
        String,
        nullable=True,
    )

    authority_reference = Column(
        String,
        nullable=True,
    )

    submitted_at = Column(
    DateTime,
    nullable=True,
    )

    created_at = Column(
    DateTime,
    default=lambda: datetime.now(
        ZoneInfo("Asia/Kolkata")
    ).replace(tzinfo=None),
    )