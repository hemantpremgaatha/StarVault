from fastapi import FastAPI

from app.db import Base, engine
from app.routers.identity import router as identity_router

app = FastAPI(title="StarVault Identity Service", version="0.2.0")
app.include_router(identity_router)


@app.on_event("startup")
def create_tables() -> None:
    # Table creation via create_all is fine for this stage of the project;
    # swap for Alembic migrations before this touches real user data.
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health() -> dict:
    return {"ok": True, "service": "identity"}
