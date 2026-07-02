import os

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.auth import router as auth_router
from app.api.requirements import router as requirements_router
from app.api.dashboard import router as dashboard_router
from app.middleware.auth import get_current_user

app = FastAPI(title="ReqPilot AI API")



frontend_origin = os.getenv(
    "FRONTEND_ORIGIN",
    "https://reqpilot-frontend.vercel.app"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        frontend_origin,
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/dashboard", tags=["dashboard"])
def dashboard(current_user: dict = Depends(get_current_user)) -> dict[str, str]:
    return {"message": f"Welcome {current_user['full_name']}"}


app.include_router(auth_router)
app.include_router(requirements_router)
app.include_router(dashboard_router)