from fastapi import FastAPI

from app.routes.auth import router as auth_router
from app.routes.clients import router as clients_router

app = FastAPI(title="ClientPilot API", version="0.1.0")

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(clients_router, prefix="/api/clients", tags=["clients"])


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "Welcome to the ClientPilot API!"}