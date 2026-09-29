from pathlib import Path

from ultralytics import YOLO


class AIService:
    """
    Handles AI model loading and inference.
    """

    MODEL_PATH = (
    Path(__file__).resolve().parents[3]
    / "ai"
    / "models"
    / "civiclens_yolo11n"
    / "best.pt"
)

    CLASS_NAMES = {
        0: "pothole",
        1: "manhole",
        2: "garbage_bin",
        3: "garbage_overflow",
    }

    def __init__(self):
        self.model = None
        self.load_model()

    def load_model(self):
        """
        Load the trained YOLO model.
        """
        if not self.MODEL_PATH.exists():
            raise FileNotFoundError(
                f"AI model not found at: {self.MODEL_PATH}"
            )

        print(f"Loading AI model: {self.MODEL_PATH}")

        self.model = YOLO(str(self.MODEL_PATH))

        print("AI model loaded successfully.")

    def predict(self, image_path: Path):
        """
        Run YOLO inference on an image.
        """

        if self.model is None:
            self.load_model()

        image_path = Path(image_path)

        if not image_path.exists():
            raise FileNotFoundError(
                f"Image not found at: {image_path}"
            )

        print(f"Running prediction: {image_path}")

        results = self.model.predict(
            source=str(image_path),
            conf=0.25,
            verbose=False,
        )

        detections = []

        for result in results:
            if result.boxes is None:
                continue

            for box in result.boxes:
                class_id = int(box.cls[0])
                confidence = float(box.conf[0])

                x1, y1, x2, y2 = box.xyxy[0].tolist()

                detections.append(
                    {
                        "class_id": class_id,
                        "class_name": self.CLASS_NAMES.get(
                            class_id,
                            f"class_{class_id}",
                        ),
                        "confidence": confidence,
                        "bbox": {
                            "x1": x1,
                            "y1": y1,
                            "x2": x2,
                            "y2": y2,
                        },
                    }
                )

        print(f"Detections found: {len(detections)}")

        return detections