# CivicLens-AI

> **AI-Powered Civic Infrastructure Monitoring System**

CivicLens-AI is a Class 12 CBSE AI capstone project that uses computer vision to identify common civic-infrastructure issues from uploaded images and convert those findings into structured, location-aware records and municipal incident reports.

The system is designed around a simple workflow:

**Upload civic problem → AI detection → structured evidence → severity → location → database → municipal incident report**

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Key Features](#key-features)
- [How It Works](#how-it-works)
- [AI Model](#ai-model)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Requirements](#requirements)
- [Installation](#installation)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Set Up Python](#2-set-up-python)
  - [3. Set Up the Backend](#3-set-up-the-backend)
  - [4. Set Up the Frontend](#4-set-up-the-frontend)
  - [5. Verify the Backend](#5-verify-the-backend)
  - [6. Start CivicLens-AI](#6-start-civiclens-ai)
- [Using the Application](#using-the-application)
- [API Overview](#api-overview)
- [Municipal Incident Reporting](#municipal-incident-reporting)
- [Severity Classification](#severity-classification)
- [Dataset](#dataset)
- [Model Evaluation](#model-evaluation)
- [Configuration Notes](#configuration-notes)
- [Local Network / Mobile Access](#local-network--mobile-access)
- [Reports](#reports)
- [Data Storage](#data-storage)
- [Troubleshooting](#troubleshooting)
- [Limitations](#limitations)
- [Future Improvements](#future-improvements)
- [Project Contribution](#project-contribution)
- [Acknowledgements](#acknowledgements)
- [License](#license)

---

## Overview

CivicLens-AI assists in documenting visible civic infrastructure problems from images.

The current prototype recognizes four categories:

| Class | Description |
|---|---|
| `pothole` | Road potholes |
| `manhole` | Manholes |
| `garbage_bin` | Garbage bins |
| `garbage_overflow` | Overflowing garbage / waste |

For each detection, the application can store:

- Issue category
- Bounding box
- Confidence score
- Prototype severity
- Source image
- Upload date and time
- Latitude
- Longitude
- Address
- Database record
- Municipal incident-report information

The application also provides detection history, dashboard statistics, map data, CSV/PDF reporting, image deletion, and a simulated municipal submission workflow.

---

## Problem Statement

Civic issues are often visible to citizens, but reporting them with structured evidence, accurate location information, and standardized documentation can be inefficient.

CivicLens-AI assists in converting an image of a civic issue into a structured, location-aware incident record that can be prepared for municipal review.

---

## Key Features

### AI-Powered Detection
- YOLO11n-based object detection
- Custom-trained civic infrastructure model
- Bounding boxes and confidence scores
- Four civic issue categories

### Image Analysis
- Upload an image through the web interface
- Automatic AI inference
- Annotated image generation
- Detection records stored in SQLite

### Civic Records
- Detection history
- Upload timestamps
- Location metadata
- Address field
- Severity classification
- Individual and bulk deletion

### Dashboard
- Detection statistics
- Severity information
- Automatically refreshed data after new uploads/deletions

### Mapping
- Latitude/longitude support
- Address support
- Map-oriented detection API

### Reporting
- CSV detection report
- PDF detection report
- Municipal incident-report workflow

### Municipal Workflow
- Create an incident report from a detection
- Assign a report number
- Mark a report as submitted
- Generate a simulated authority reference
- Record submission time
- Demonstrate the workflow required for future municipal-system integration

---

## How It Works

```text
                    ┌──────────────────┐
                    │   User Uploads   │
                    │      Image       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  FastAPI Upload  │
                    │    Endpoint      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   YOLO11n AI     │
                    │     Model        │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │  Detections +    │
                    │ Bounding Boxes +  │
                    │ Confidence Scores │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ Severity +        │
                    │ Location Metadata │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ SQLite Database  │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        Dashboard        History        Reports
                                             │
                                             ▼
                                  Municipal Incident
                                      Report Workflow
```

---

## AI Model

CivicLens-AI uses **YOLO11n** with the Ultralytics framework and PyTorch.

The trained model is located at:

```text
ai/models/civiclens_yolo11n/best.pt
```

### Model Classes

```text
0 → pothole
1 → manhole
2 → garbage_bin
3 → garbage_overflow
```

### Inference

The backend loads the trained model directly and performs inference when an image is uploaded.

The current inference confidence threshold is:

```text
0.25
```

The system generates an annotated image containing the model's detected bounding boxes.

---

## Technology Stack

### AI / Machine Learning

- Python
- Ultralytics YOLO11n
- PyTorch
- OpenCV
- Custom civic-infrastructure dataset

### Backend

- FastAPI
- Uvicorn
- SQLAlchemy
- SQLite
- ReportLab
- Python `zoneinfo`

### Frontend

- React
- Vite
- JavaScript
- CSS
- React Leaflet / Leaflet for map functionality

### Development

- Git
- GitHub
- Windows 11
- NVIDIA CUDA-compatible GPU recommended for training

---

## Project Structure

```text
CivicLens-AI/
│
├── ai/
│   ├── datasets/
│   │   └── civiclens_dataset/
│   │       ├── train/
│   │       ├── valid/
│   │       └── test/
│   │
│   └── models/
│       └── civiclens_yolo11n/
│           └── best.pt
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── upload.py
│   │   │   ├── health.py
│   │   │   ├── detections.py
│   │   │   ├── reports.py
│   │   │   └── incident_reports.py
│   │   │
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   ├── database_session.py
│   │   │   └── init_db.py
│   │   │
│   │   ├── crud/
│   │   ├── models/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── uploads/
│   ├── reports/
│   ├── requirements.txt
│   └── .venv/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── App.css
│   ├── package.json
│   └── vite.config.js
│
├── .python-version
└── README.md
```

> Generated files such as virtual environments, `node_modules`, SQLite databases, uploaded images, and local report output should not be committed unless intentionally required by the project.

---

# Requirements

## Hardware

Recommended for AI training:

- NVIDIA GPU with CUDA support
- 6 GB+ VRAM recommended for the project's training configuration
- 16 GB RAM recommended
- SSD storage recommended

The trained model can be used for inference on systems without a CUDA-capable GPU, although inference may be slower.

## Software

- Windows, Linux, or macOS
- Python **3.11.x**
- Node.js
- npm
- Git

The development environment used for the project includes Python **3.11.9**.

---

# Installation

## 1. Clone the Repository

```bash
git clone https://github.com/StarkForge8956/CivicLens-AI.git
cd CivicLens-AI
```

If the repository has already been downloaded as a ZIP, extract it and open a terminal in the project directory.

---

## 2. Set Up Python

The project uses Python 3.11.

Verify:

```bash
python --version
```

or on Windows:

```powershell
py --version
```

---

## 3. Set Up the Backend

Open a terminal:

```powershell
cd backend
```

Create a virtual environment:

```powershell
py -3.11 -m venv .venv
```

If Python 3.11 is already the default Python:

```powershell
python -m venv .venv
```

### Windows PowerShell

If PowerShell blocks virtual-environment activation, you do not need to activate it.

Install dependencies directly:

```powershell
.\.venv\Scripts\python.exe -m pip install --upgrade pip
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

The backend dependencies include:

```text
fastapi
uvicorn
python-multipart
SQLAlchemy
ReportLab
Ultralytics
PyTorch
tzdata
```

`tzdata` is required by the project's India Standard Time handling on systems where the timezone database is not otherwise available.

---

## 4. Set Up the Frontend

Open another terminal:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

---

## 5. Verify the Backend

Start FastAPI from the `backend` directory:

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

The API should be available at:

```text
http://127.0.0.1:8000
```

FastAPI's interactive documentation is available at:

```text
http://127.0.0.1:8000/docs
```

Health endpoint:

```text
http://127.0.0.1:8000/api/health/
```

---

## 6. Start CivicLens-AI

Keep the backend terminal running.

Open a second terminal:

```powershell
cd frontend
npm run dev
```

Vite will display the local frontend URL, normally:

```text
http://localhost:5173/
```

Open that address in a browser.

---

# Using the Application

## 1. Upload an Image

Open the Upload section and select a civic-infrastructure image.

Optional location fields can be supplied:

- Latitude
- Longitude
- Address

The image is sent to the FastAPI backend.

## 2. AI Analysis

The backend:

1. Stores the uploaded image.
2. Loads the trained YOLO11n model.
3. Runs inference.
4. Extracts detected classes.
5. Extracts confidence scores.
6. Extracts bounding boxes.
7. Calculates prototype severity.
8. Stores the image and detection records.
9. Returns the analysis result to the frontend.

## 3. Review Results

The dashboard and detection history can display:

- Number of detections
- Issue category
- Confidence
- Severity
- Upload time
- Location
- Image preview

## 4. Create a Municipal Incident Report

A detection can be converted into a structured incident report.

The prototype generates:

```text
CL-YYYY-XXXXX
```

as the report number.

The report can then be submitted through the demonstration municipal workflow.

---

# API Overview

Base URL:

```text
http://127.0.0.1:8000
```

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health/` | API health check |
| POST | `/api/upload` | Upload and analyze an image |
| GET | `/api/images` | List image history |
| GET | `/api/images/{id}` | Get image information |
| GET | `/api/images/{id}/result` | Get analysis result |
| DELETE | `/api/images/{id}` | Delete an image and related records |
| DELETE | `/api/images/bulk` | Delete multiple images |
| GET | `/api/detections` | List detections |
| GET | `/api/detections/{id}` | Get a detection |
| GET | `/api/map` | Retrieve map-oriented detection data |
| GET | `/api/reports/csv` | Generate CSV report |
| GET | `/api/reports/pdf` | Generate PDF report |
| POST | `/api/incident-reports/{detection_id}` | Create incident report |
| GET | `/api/incident-reports` | List incident reports |
| GET | `/api/incident-reports/{report_id}` | Get incident report |
| POST | `/api/incident-reports/{report_id}/submit` | Submit incident report |

Interactive API documentation:

```text
http://127.0.0.1:8000/docs
```

---

# Municipal Incident Reporting

CivicLens-AI includes a prototype municipal reporting workflow:

```text
Detection
   ↓
Create Incident Report
   ↓
Draft
   ↓
Submit
   ↓
Submitted
   ↓
Authority Reference
```

A submitted report records:

- Report number
- Detection ID
- Authority name
- Authority reference
- Submission timestamp
- Report status

### Important

The current project **does not have a live integration with a government or municipal authority**.

The municipal submission endpoint is a **simulated demonstration workflow** showing how CivicLens-AI could prepare and submit structured civic reports.

A production version could integrate this workflow with the relevant municipal grievance-management system.

---

# Severity Classification

The current severity system is a prototype heuristic.

It considers:

- Detection bounding-box area
- Detection confidence

Current logic:

```text
Large area + confidence ≥ 0.50 → High

Area ≥ 300,000 OR confidence ≥ 0.50 → Medium

Otherwise → Low
```

This should not be interpreted as a professional civil-engineering assessment.

A production system should incorporate domain-specific measurements and expert validation.

---

# Dataset

The custom dataset used for the project contains:

| Split | Images | Labels |
|---|---:|---:|
| Train | 2,150 | 2,150 |
| Validation | 318 | 318 |
| Test | 156 | 156 |

Total:

```text
2,624 images
```

The dataset contains four classes:

```text
pothole
manhole
garbage_bin
garbage_overflow
```

### Dataset Label Counts

| Class | Instances |
|---|---:|
| Pothole | 1,667 |
| Manhole | 588 |
| Garbage Bin | 692 |
| Garbage Overflow | 826 |

---

# Model Evaluation

The official clean test evaluation was performed on:

```text
156 test images
271 ground-truth instances
```

Overall results:

| Metric | Score |
|---|---:|
| Precision | 71.63% |
| Recall | 60.14% |
| mAP@50 | 67.60% |
| mAP@50–95 | 39.53% |

### Per-Class Results

| Class | Precision | Recall | mAP@50 | mAP@50–95 |
|---|---:|---:|---:|---:|
| Pothole | 69.2% | 52.9% | 61.4% | 33.6% |
| Manhole | 70.9% | 65.3% | 74.9% | 45.5% |
| Garbage Bin | 77.6% | 81.2% | 84.9% | 55.2% |
| Garbage Overflow | 68.9% | 41.1% | 49.2% | 23.9% |

The model was trained for 50 epochs at 640px image size with batch size 8 using an NVIDIA RTX 3050 6 GB Laptop GPU.

---

# Configuration Notes

## Model Location

The backend expects:

```text
ai/models/civiclens_yolo11n/best.pt
```

If this file is missing, AI inference will fail.

## Timezone

CivicLens-AI records application timestamps using:

```text
Asia/Kolkata
```

The backend uses Python's `zoneinfo` support.

## Local Storage

The prototype uses local storage for:

- Uploaded images
- Annotated images
- SQLite database
- Generated CSV/PDF reports

This makes the project straightforward to run locally without requiring a cloud database or external storage service.

---

# Local Network / Mobile Access

The backend can serve a mobile browser when the phone and computer are connected to the same local network.

By default, `127.0.0.1` only refers to the computer running the backend.

For local-network access, start FastAPI with:

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Then configure the frontend to use the computer's local network IP, for example:

```text
http://192.168.1.100:8000
```

The exact IP depends on the local network.

> Mobile access requires the frontend and backend to be reachable from the phone and may also require Windows Firewall configuration.

---

# Reports

## CSV

The CSV report contains information including:

- Image ID
- Original filename
- Upload time
- Status
- Latitude
- Longitude
- Address
- Detection
- Confidence
- Severity
- Bounding-box coordinates

Endpoint:

```text
GET /api/reports/csv
```

## PDF

The PDF report provides a formatted detection report containing:

- CivicLens-AI branding
- Detection information
- Location information
- Confidence
- Severity

Endpoint:

```text
GET /api/reports/pdf
```

---

# Data Storage

The prototype uses **SQLite** with **SQLAlchemy**.

The main data entities include:

### Images

Stores:

- Original filename
- Stored filename
- Upload time
- Processing status
- Latitude
- Longitude
- Address

### Detections

Stores:

- Image ID
- Class ID
- Class name
- Confidence
- Bounding box
- Severity
- Detection timestamp

### Incident Reports

Stores:

- Report number
- Detection ID
- Status
- Authority name
- Authority reference
- Created timestamp
- Submitted timestamp

Deleting an image also removes its associated detections and incident-report records.

---

# Troubleshooting

## PowerShell will not activate `.venv`

You may see an execution-policy error when running:

```powershell
.\.venv\Scripts\Activate.ps1
```

Activation is not required.

Use:

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

and:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

---

## Model not found

Check:

```text
ai/models/civiclens_yolo11n/best.pt
```

The backend expects the trained model at that location.

---

## Backend cannot start

Check:

```powershell
.\.venv\Scripts\python.exe --version
```

Then reinstall dependencies:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

---

## Frontend dependencies missing

From `frontend`:

```powershell
npm install
```

Then:

```powershell
npm run dev
```

---

## Port 8000 is already in use

Stop the existing FastAPI process or start the backend on another port:

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8001
```

If the port changes, update the frontend API base URL accordingly.

---

## Timezone error involving `Asia/Kolkata`

Install:

```powershell
.\.venv\Scripts\python.exe -m pip install tzdata
```

Then restart FastAPI.

---

# Limitations

CivicLens-AI is a working academic prototype rather than a production municipal platform.

Current limitations include:

- Image upload rather than continuous live-camera analysis
- No production government API integration
- Municipal submission is simulated
- Severity classification is heuristic
- Model performance depends on the training dataset
- No production authentication/authorization system
- SQLite is intended for local/prototype usage
- Local filesystem storage is used for images and reports
- No production-scale distributed inference system
- Address/location data depends on information supplied to the application
- The AI model should not be treated as a final civil-engineering authority

---

# Future Improvements

Potential future development includes:

- Live CCTV/drone video inference
- Improved dataset diversity
- Larger and stronger detection models
- Human verification of AI detections
- More sophisticated severity estimation
- Automatic GPS acquisition
- Reverse geocoding
- Production cloud deployment
- PostgreSQL or another production database
- Authentication and role-based access
- Municipal API integrations
- Authority-specific routing
- Citizen notification system
- Email/SMS/push notifications
- Analytics and historical trend analysis
- Model monitoring and retraining pipelines
- Mobile/PWA optimization
- Offline-first field reporting

---

# Project Contribution

The project covers multiple parts of an end-to-end AI application:

### AI / Model Development

- Dataset preparation
- YOLO11n training
- Model evaluation
- Class mapping
- Inference integration

### Backend Development

- FastAPI API development
- SQLAlchemy database layer
- SQLite persistence
- AI-to-backend integration
- Image processing workflow
- Detection storage
- Severity processing
- Reporting
- Incident-report workflow

### Frontend

- React interface
- Dashboard
- Upload interface
- Detection history
- Map interface
- Report workflow
- Civic incident workflow

---

# Acknowledgements

CivicLens-AI uses the following open-source technologies:

- Ultralytics
- PyTorch
- FastAPI
- SQLAlchemy
- React
- Vite
- Leaflet / React Leaflet
- ReportLab

---

# License

No open-source license has currently been specified for this project.

If this repository is intended for public reuse or distribution, add an appropriate `LICENSE` file and update this section.

---

## Project Status

**Current status: Working academic prototype**

The core end-to-end workflow is operational:

```text
Image Upload
      ↓
YOLO11n Detection
      ↓
Bounding Boxes + Confidence
      ↓
Severity Classification
      ↓
Database Storage
      ↓
Dashboard / History / Map
      ↓
CSV / PDF Reporting
      ↓
Municipal Incident Report
      ↓
Simulated Submission
```

---

## Repository

**CivicLens-AI**

https://github.com/StarkForge8956/CivicLens-AI
