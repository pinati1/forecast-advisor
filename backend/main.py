from contextlib import asynccontextmanager

from fastapi import FastAPI

from routes import health, beach
from db import connect_to_mongo, close_mongo_connection


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()


app = FastAPI(title="Surf Forecast API", lifespan=lifespan)


app.include_router(health.router)
app.include_router(beach.router)


@app.get("/")
async def root():
    return {"message": "Surf Forecast API"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
