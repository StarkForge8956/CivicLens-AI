from fastapi import FastAPI

app = FastAPI(title="InfraScan AI API")

@app.get("/")
def home():
    return {"message": "InfraScan AI Backend Running"}