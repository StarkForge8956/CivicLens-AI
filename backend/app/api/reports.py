import csv

from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

from app.core.config import REPORT_DIR
from app.core.database_session import get_db
from app.models.detection import Detection
from app.models.image import Image


router = APIRouter()


@router.get("/reports/csv")
def generate_csv_report(
    db: Session = Depends(get_db),
):
    """
    Generate a CSV report containing all images and detections.
    """

    report_path = REPORT_DIR / "civiclens_report.csv"

    rows = (
        db.query(Image, Detection)
        .outerjoin(
            Detection,
            Image.id == Detection.image_id
        )
        .order_by(Image.id.desc())
        .all()
    )

    with open(
        report_path,
        "w",
        newline="",
        encoding="utf-8",
    ) as file:

        writer = csv.writer(file)

        writer.writerow([
            "Image ID",
            "Original Filename",
            "Upload Time",
            "Status",
            "Latitude",
            "Longitude",
            "Address",
            "Detection",
            "Confidence",
            "Severity",
            "X1",
            "Y1",
            "X2",
            "Y2",
        ])

        for image, detection in rows:
            writer.writerow([
                image.id,
                image.original_filename,
                image.upload_time,
                image.status,
                image.latitude,
                image.longitude,
                image.address,
                detection.class_name if detection else "",
                detection.confidence if detection else "",
                detection.severity if detection else "",
                detection.x1 if detection else "",
                detection.y1 if detection else "",
                detection.x2 if detection else "",
                detection.y2 if detection else "",
            ])

    return FileResponse(
        path=report_path,
        media_type="text/csv",
        filename="civiclens_report.csv",
    )


@router.get("/reports/pdf")
def generate_pdf_report(
    db: Session = Depends(get_db),
):
    """
    Generate a PDF report containing all images and detections.
    """

    report_path = REPORT_DIR / "civiclens_report.pdf"

    rows = (
        db.query(Image, Detection)
        .outerjoin(
            Detection,
            Image.id == Detection.image_id
        )
        .order_by(Image.id.desc())
        .all()
    )

    document = SimpleDocTemplate(
        str(report_path),
        pagesize=A4,
        rightMargin=15 * mm,
        leftMargin=15 * mm,
        topMargin=15 * mm,
        bottomMargin=15 * mm,
    )

    styles = getSampleStyleSheet()

    story = []

    story.append(
        Paragraph(
            "CivicLens-AI",
            styles["Title"],
        )
    )

    story.append(
        Paragraph(
            "AI-Powered Civic Infrastructure Monitoring System",
            styles["Heading2"],
        )
    )

    story.append(Spacer(1, 8 * mm))

    story.append(
        Paragraph(
            "Detection Report",
            styles["Heading2"],
        )
    )

    story.append(Spacer(1, 5 * mm))

    data = [[
        "Image",
        "Location",
        "Detection",
        "Confidence",
        "Severity",
    ]]

    for image, detection in rows:

        location = image.address or "Not provided"

        if image.latitude is not None and image.longitude is not None:
            location += (
                f"<br/>"
                f"Lat: {image.latitude}<br/>"
                f"Lon: {image.longitude}"
            )

        if detection:
            detection_name = detection.class_name
            confidence = f"{detection.confidence:.2%}"
            severity = detection.severity or "N/A"
        else:
            detection_name = "No detection"
            confidence = "N/A"
            severity = "N/A"

        data.append([
            str(image.id),
            Paragraph(location, styles["BodyText"]),
            detection_name,
            confidence,
            severity,
        ])

    table = Table(
        data,
        repeatRows=1,
        colWidths=[
            15 * mm,
            65 * mm,
            40 * mm,
            30 * mm,
            25 * mm,
        ],
    )

    table.setStyle(
        TableStyle([
            (
                "BACKGROUND",
                (0, 0),
                (-1, 0),
                colors.HexColor("#1f2937"),
            ),
            (
                "TEXTCOLOR",
                (0, 0),
                (-1, 0),
                colors.white,
            ),
            (
                "FONTNAME",
                (0, 0),
                (-1, 0),
                "Helvetica-Bold",
            ),
            (
                "GRID",
                (0, 0),
                (-1, -1),
                0.5,
                colors.grey,
            ),
            (
                "VALIGN",
                (0, 0),
                (-1, -1),
                "TOP",
            ),
            (
                "FONTSIZE",
                (0, 0),
                (-1, -1),
                8,
            ),
            (
                "ROWBACKGROUNDS",
                (0, 1),
                (-1, -1),
                [
                    colors.white,
                    colors.HexColor("#f3f4f6"),
                ],
            ),
        ])
    )

    story.append(table)

    story.append(Spacer(1, 8 * mm))

    story.append(
        Paragraph(
            "Generated by CivicLens-AI",
            styles["Normal"],
        )
    )

    document.build(story)

    return FileResponse(
        path=report_path,
        media_type="application/pdf",
        filename="civiclens_report.pdf",
    )