from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database_session import get_db
from app.models.detection import Detection
from app.models.image import Image
from app.models.incident_report import IncidentReport


router = APIRouter()


@router.post("/incident-reports/{detection_id}")
def create_incident_report(
    detection_id: int,
    db: Session = Depends(get_db),
):
    detection = (
        db.query(Detection)
        .filter(Detection.id == detection_id)
        .first()
    )

    if not detection:
        raise HTTPException(
            status_code=404,
            detail="Detection not found.",
        )

    report_number = (
        f"CL-{datetime.utcnow().year}-"
        f"{detection.id:05d}"
    )

    existing_report = (
        db.query(IncidentReport)
        .filter(
            IncidentReport.detection_id == detection_id
        )
        .first()
    )

    if existing_report:
        return {
            "message": "Incident report already exists.",
            "report_id": existing_report.id,
            "report_number": existing_report.report_number,
            "status": existing_report.status,
        }

    report = IncidentReport(
        report_number=report_number,
        detection_id=detection_id,
        status="Draft",
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    return {
        "message": "Incident report created successfully.",
        "report_id": report.id,
        "report_number": report.report_number,
        "detection_id": report.detection_id,
        "status": report.status,
    }


@router.get("/incident-reports")
def get_incident_reports(
    db: Session = Depends(get_db),
):
    reports = (
        db.query(IncidentReport)
        .order_by(IncidentReport.created_at.desc())
        .all()
    )

    return [
        {
            "id": report.id,
            "report_number": report.report_number,
            "detection_id": report.detection_id,
            "status": report.status,
            "authority_name": report.authority_name,
            "authority_reference": report.authority_reference,
            "submitted_at": report.submitted_at,
            "created_at": report.created_at,
        }
        for report in reports
    ]
@router.get("/incident-reports/{report_id}")
def get_incident_report(
    report_id: int,
    db: Session = Depends(get_db),
):
    report = (
        db.query(IncidentReport)
        .filter(IncidentReport.id == report_id)
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Incident report not found.",
        )

    detection = (
        db.query(Detection)
        .filter(Detection.id == report.detection_id)
        .first()
    )

    if not detection:
        raise HTTPException(
            status_code=404,
            detail="Detection associated with report not found.",
        )

    image = (
        db.query(Image)
        .filter(Image.id == detection.image_id)
        .first()
    )

    if not image:
        raise HTTPException(
            status_code=404,
            detail="Image associated with detection not found.",
        )

    return {
        "report": {
            "id": report.id,
            "report_number": report.report_number,
            "status": report.status,
            "authority_name": report.authority_name,
            "authority_reference": report.authority_reference,
            "submitted_at": report.submitted_at,
            "created_at": report.created_at,
        },
        "incident": {
            "image_id": image.id,
            "original_filename": image.original_filename,
            "stored_filename": image.stored_filename,
            "upload_time": image.upload_time,
            "latitude": image.latitude,
            "longitude": image.longitude,
            "address": image.address,
        },
        "detection": {
            "id": detection.id,
            "class_name": detection.class_name,
            "class_id": detection.class_id,
            "confidence": detection.confidence,
            "severity": detection.severity,
            "bbox": {
                "x1": detection.x1,
                "y1": detection.y1,
                "x2": detection.x2,
                "y2": detection.y2,
            },
            "created_at": detection.created_at,
        },
    }
@router.post("/incident-reports/{report_id}/submit")
def submit_incident_report(
    report_id: int,
    db: Session = Depends(get_db),
):
    report = (
        db.query(IncidentReport)
        .filter(IncidentReport.id == report_id)
        .first()
    )

    if not report:
        raise HTTPException(
            status_code=404,
            detail="Incident report not found.",
        )

    if report.status == "Submitted":
        return {
            "message": "Incident report has already been submitted.",
            "report_id": report.id,
            "report_number": report.report_number,
            "status": report.status,
            "authority_name": report.authority_name,
            "authority_reference": report.authority_reference,
        }

    report.status = "Submitted"
    report.authority_name = "Municipal Authority"
    report.authority_reference = (
        f"MA-{datetime.utcnow().year}-{report.id:05d}"
    )
    report.submitted_at = datetime.utcnow()

    db.commit()
    db.refresh(report)

    return {
        "message": "Incident report submitted successfully.",
        "report_id": report.id,
        "report_number": report.report_number,
        "status": report.status,
        "authority_name": report.authority_name,
        "authority_reference": report.authority_reference,
        "submitted_at": report.submitted_at,
    }