"""Authentication routes: login, logout, and current-owner identity."""

from typing import Annotated


from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.dependencies.auth import CurrentUser
from app.db.session import get_db
from app.schemas.auth import LoginRequest, OwnerRead, RegisterRequest
from app.services.auth_service import (
    AuthService,
    DuplicateOwnerError,
    InvalidCredentialsError,
)

router = APIRouter()


@router.post("/register", response_model=OwnerRead, status_code=status.HTTP_201_CREATED)
def register(
    payload: RegisterRequest,
    db: Annotated[Session, Depends(get_db)],
) -> OwnerRead:
    try:
        owner = AuthService(db).register_owner(
            email=str(payload.email),
            password=payload.password.get_secret_value(),
            full_name=payload.full_name,
            phone_number=payload.phone_number,
        )
    except DuplicateOwnerError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An owner with this email already exists",
        ) from None
    return OwnerRead.model_validate(owner)


@router.post("/login", response_model=OwnerRead)
def login(
    payload: LoginRequest,
    response: Response,
    db: Annotated[Session, Depends(get_db)],
) -> OwnerRead:
    try:
        owner, token = AuthService(db).login(
            payload.email, payload.password.get_secret_value()
        )
    except InvalidCredentialsError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        ) from None

    settings = get_settings()
    response.set_cookie(
        key="clientpilot_session",
        value=token,
        max_age=settings.auth_session_ttl_hours * 60 * 60,
        httponly=True,
        secure=settings.auth_cookie_secure,
        samesite="strict",
        path="/",
    )
    return OwnerRead.model_validate(owner)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    request: Request,
    response: Response,
    db: Annotated[Session, Depends(get_db)],
) -> Response:
    token = request.cookies.get("clientpilot_session")
    if token is not None:
        AuthService(db).logout(token)
    response.delete_cookie(
        key="clientpilot_session",
        path="/",
        secure=get_settings().auth_cookie_secure,
        httponly=True,
        samesite="strict",
    )
    response.status_code = status.HTTP_204_NO_CONTENT
    return response


@router.get("/me", response_model=OwnerRead)
def read_current_owner(owner: CurrentUser) -> OwnerRead:
    return OwnerRead.model_validate(owner)
