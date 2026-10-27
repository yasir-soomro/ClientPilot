"""Authentication routes: login, logout, and current-owner identity."""

from typing import Annotated
from urllib.parse import quote


from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.dependencies.auth import AuthenticatedUser
from app.db.session import get_db
from app.schemas.auth import LoginRequest, OwnerRead, RegisterRequest, ResendVerificationRequest, VerifyEmailRequest
from app.services.auth_service import (
    AuthService,
    DuplicateOwnerError,
    InvalidCredentialsError,
    VerificationError,
    VerificationRateLimitError,
    VerificationDeliveryError,
    OAuthError,
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
    try:
        AuthService(db).send_verification_code(owner)
    except VerificationRateLimitError:
        pass
    except VerificationDeliveryError as error:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(error)) from None
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
    except VerificationError as error:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(error)) from None

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
def read_current_owner(owner: AuthenticatedUser) -> OwnerRead:
    return OwnerRead.model_validate(owner)


@router.post("/verify-email", response_model=OwnerRead)
def verify_email(payload: VerifyEmailRequest, response: Response, db: Annotated[Session, Depends(get_db)]) -> OwnerRead:
    try:
        owner, token = AuthService(db).verify_email(str(payload.email), payload.code)
    except VerificationError as error:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(error)) from None
    settings = get_settings()
    response.set_cookie(key="clientpilot_session", value=token, max_age=settings.auth_session_ttl_hours * 60 * 60, httponly=True, secure=settings.auth_cookie_secure, samesite="strict", path="/")
    return OwnerRead.model_validate(owner)


@router.post("/resend-verification", status_code=status.HTTP_204_NO_CONTENT)
def resend_verification(payload: ResendVerificationRequest, db: Annotated[Session, Depends(get_db)]) -> Response:
    owner = AuthService(db).repository.get_user_by_email(str(payload.email).strip().lower())
    if owner is not None and not owner.email_verified:
        try:
            AuthService(db).send_verification_code(owner, resend=True)
        except VerificationRateLimitError as error:
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=str(error)) from None
        except VerificationDeliveryError as error:
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(error)) from None
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/dev/verification-code")
def development_verification_code(
    email: str,
    request: Request,
) -> dict[str, str]:
    settings = get_settings()
    client_host = request.client.host if request.client is not None else None
    if (
        settings.app_environment != "development"
        or not settings.development_otp_enabled
        or client_host not in {"127.0.0.1", "::1", "localhost"}
    ):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Not found")
    entry = AuthService.get_development_verification_code(email)
    if entry is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No active development verification code")
    code, expires_at = entry
    return {"code": code, "expires_at": expires_at.isoformat()}


@router.get("/oauth/{provider}/start")
def start_oauth(provider: str, db: Annotated[Session, Depends(get_db)]) -> RedirectResponse:
    try:
        authorization_url, _ = AuthService(db).create_oauth_state(provider)
    except OAuthError as error:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(error)) from None
    return RedirectResponse(authorization_url, status_code=status.HTTP_302_FOUND)


@router.get("/oauth/{provider}/link/start")
def start_oauth_link(provider: str, owner: AuthenticatedUser, db: Annotated[Session, Depends(get_db)]) -> RedirectResponse:
    try:
        authorization_url, _ = AuthService(db).create_oauth_state(provider, owner.id)
    except OAuthError as error:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(error)) from None
    return RedirectResponse(authorization_url, status_code=status.HTTP_302_FOUND)


@router.get("/oauth/{provider}/callback")
def oauth_callback(
    provider: str,
    request: Request,
    db: Annotated[Session, Depends(get_db)],
) -> RedirectResponse:
    settings = get_settings()
    frontend_url = settings.frontend_base_url.rstrip("/")
    error = request.query_params.get("error")
    code = request.query_params.get("code")
    state = request.query_params.get("state")
    if error or not code or not state:
        return RedirectResponse(f"{frontend_url}/login?error=oauth_cancelled", status_code=status.HTTP_303_SEE_OTHER)
    try:
        _, token, _, _ = AuthService(db).finish_oauth(provider, code, state)
    except VerificationDeliveryError:
        return RedirectResponse(f"{frontend_url}/login?error=email_delivery_unavailable", status_code=status.HTTP_303_SEE_OTHER)
    except VerificationError as error:
        query = f"?email={quote(error.email)}" if error.email else ""
        return RedirectResponse(f"{frontend_url}/verify-email{query}", status_code=status.HTTP_303_SEE_OTHER)
    except OAuthError:
        return RedirectResponse(f"{frontend_url}/login?error=oauth_failed", status_code=status.HTTP_303_SEE_OTHER)

    response = RedirectResponse(f"{frontend_url}/dashboard", status_code=status.HTTP_303_SEE_OTHER)
    response.set_cookie(
        key="clientpilot_session",
        value=token,
        max_age=settings.auth_session_ttl_hours * 60 * 60,
        httponly=True,
        secure=settings.auth_cookie_secure,
        samesite="strict",
        path="/",
    )
    return response
