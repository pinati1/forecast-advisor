from fastapi import FastAPI

from routes import health, beach


app = FastAPI(title="Surf Forecast API")


app.include_router(health.router)
app.include_router(beach.router)


@app.get("/")
async def root():
    return {"message": "Surf Forecast API"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
