from pathlib import Path

# Project paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Application settings
APP_NAME = "CivicLens-AI API"
APP_VERSION = "1.0.0"
APP_DESCRIPTION = "AI-Powered Civic Infrastructure Monitoring System"

# Directories
# Render persistent disk is mounted at /var/data
PERSISTENT_DIR = Path("/var/data")

UPLOAD_DIR = PERSISTENT_DIR / "uploads"
REPORT_DIR = PERSISTENT_DIR / "reports"
DATABASE_PATH = PERSISTENT_DIR / "civiclens.db"

# Create required directories if they don't exist
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
REPORT_DIR.mkdir(parents=True, exist_ok=True)

# Upload settings

ALLOWED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png"
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB