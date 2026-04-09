from contextlib import asynccontextmanager
import os
from fastapi import FastAPI
from dotenv import load_dotenv
from routes import health, beach
from db import MongoHandler
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("MONGO_DB_NAME")

@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.db = MongoHandler(MONGO_URL, DB_NAME)
    yield 
    app.state.db.close_connection()


app = FastAPI(title="Surf Forecast API", lifespan=lifespan)


app.include_router(health.router)
app.include_router(beach.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Allow your React app
    allow_credentials=True,
    allow_methods=["*"], # Allow all types of requests (GET, POST, etc.)
    allow_headers=["*"], # Allow all headers
)

@app.get("/")
async def root():
    return {"message": "Surf Forecast API"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
