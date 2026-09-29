def calculate_severity(
    class_name: str,
    confidence: float,
    bbox: dict,
) -> str:
    """
    Calculate issue severity using detection confidence
    and bounding-box size.
    """

    width = bbox["x2"] - bbox["x1"]
    height = bbox["y2"] - bbox["y1"]
    area = width * height

    # Large detected issue
    if area >= 1000000 and confidence >= 0.50:
        return "High"

    # Medium-sized or reasonably confident issue
    if area >= 300000 or confidence >= 0.50:
        return "Medium"

    return "Low"