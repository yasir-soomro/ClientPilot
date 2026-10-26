from fastapi import FastAPI

from app.routes.auth import router as auth_router
from app.routes.clients import router as clients_router
from app.routes.projects import router as projects_router

app = FastAPI(title="ClientPilot API", version="0.1.0")

app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(clients_router, prefix="/api/clients", tags=["clients"])
app.include_router(projects_router, prefix="/api/projects", tags=["projects"])


@app.get("/")
async def root() -> dict[str, str]:
    return {"message": "Welcome to the ClientPilot API!"}