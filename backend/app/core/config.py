from pathlib import Path

# Project paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Application settings
APP_NAME = "CivicLens-AI API"
APP_VERSION = "1.0.0"
APP_DESCRIPTION = "AI-Powered Civic Infrastructure Monitoring System"

# Directories
UPLOAD_DIR = BASE_DIR / "uploads"
REPORT_DIR = BASE_DIR / "reports"
DATABASE_PATH = BASE_DIR / "civiclens.db"

# Create required directories if they don't exist
UPLOAD_DIR.mkdir(exist_ok=True)
REPORT_DIR.mkdir(exist_ok=True)

# Upload settings

ALLOWED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png"
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB