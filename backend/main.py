from fastapi import FastAPI

app = FastAPI(
    title="CivicLens-AI API",
    version="1.0.0",
    description="AI-Powered Civic Infrastructure Monitoring System"
)

@app.get("/")
def home():
    return {
        "message": "Welcome to CivicLens-AI API"
    }