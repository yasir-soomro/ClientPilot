from datetime import UTC, datetime, timedelta
import hashlib
import logging
import secrets
import smtplib
import json
from urllib.parse import urlencode
from urllib.request import Request as UrlRequest, urlopen
from email.message import EmailMessage

from pydantic import EmailStr, TypeAdapter
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.core.security import (
    DUMMY_PASSWORD_HASH,
    create_session_token,
    hash_password,
    hash_session_token,
    verify_password,
)
from app.core.config import get_settings
from app.models.user import User
from app.models.auth_challenge import AuthChallenge
from app.models.auth_provider import AuthProviderIdentity
from app.models.auth_oauth_state import AuthOAuthState
from app.repositories.auth_repository import AuthRepository

_email_adapter = TypeAdapter(EmailStr)
logger = logging.getLogger(__name__)
_development_otp_codes: dict[str, tuple[str, datetime]] = {}


def _utc(value: datetime) -> datetime:
    return value.replace(tzinfo=UTC) if value.tzinfo is None else value


class InvalidCredentialsError(Exception):
    pass


class DuplicateOwnerError(Exception):
    pass


class VerificationError(Exception):
    def __init__(self, message: str, *, email: str | None = None) -> None:
        super().__init__(message)
        self.email = email


class VerificationRateLimitError(VerificationError):
    pass


class VerificationDeliveryError(VerificationError):
    pass


class OAuthError(Exception):
    pass


class AuthService:
    def __init__(self, db: Session) -> None:
        self.db = db
        self.repository = AuthRepository(db)

    def register_owner(
        self,
        email: str,
        password: str,
        full_name: str,
        phone_number: str,
    ) -> User:
        if not 12 <= len(password) <= 128:
            raise ValueError("Password must be between 12 and 128 characters.")
        normalized_email = str(_email_adapter.validate_python(email.strip())).lower()
        if self.repository.get_user_by_email(normalized_email) is not None:
            raise DuplicateOwnerError("An owner with this email already exists.")

        try:
            user = self.repository.create_user(
                email=normalized_email,
                password_hash=hash_password(password),
                full_name=full_name,
                phone_number=phone_number,
            )
            self.db.commit()
        except IntegrityError:
            self.db.rollback()
            if self.repository.get_user_by_email(normalized_email) is not None:
                raise DuplicateOwnerError(
                    "An owner with this email already exists."
                ) from None
            raise
        self.db.refresh(user)
        return user

    @staticmethod
    def _code_hash(code: str, salt: str) -> str:
        return hashlib.sha256(f"{salt}:{code}".encode("utf-8")).hexdigest()

    def _deliver_verification_code(self, email: str, code: str) -> None:
        settings = get_settings()
        if not settings.smtp_host or not settings.smtp_from_email:
            if settings.app_environment in {"development", "test"} and settings.development_otp_enabled:
                _development_otp_codes[email] = (code, datetime.now(UTC) + timedelta(minutes=settings.email_otp_ttl_minutes))
                return
            raise VerificationDeliveryError("Email verification delivery is not configured.")
        message = EmailMessage()
        message["Subject"] = "Verify your ClientPilot email"
        message["From"] = settings.smtp_from_email
        message["To"] = email
        message.set_content(f"Your ClientPilot verification code is {code}. It expires in {settings.email_otp_ttl_minutes} minutes.")
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10) as smtp:
            smtp.starttls()
            if settings.smtp_username and settings.smtp_password:
                smtp.login(settings.smtp_username, settings.smtp_password)
            smtp.send_message(message)

    @staticmethod
    def get_development_verification_code(email: str) -> tuple[str, datetime] | None:
        entry = _development_otp_codes.get(email.strip().lower())
        if entry is None or entry[1] <= datetime.now(UTC):
            _development_otp_codes.pop(email.strip().lower(), None)
            return None
        return entry

    def send_verification_code(self, owner: User, *, resend: bool = False) -> None:
        settings = get_settings()
        now = datetime.now(UTC)
        latest = self.db.scalar(select(AuthChallenge).where(AuthChallenge.owner_id == owner.id, AuthChallenge.consumed_at.is_(None)).order_by(AuthChallenge.created_at.desc()))
        if latest is not None and (now - _utc(latest.last_sent_at)).total_seconds() < settings.email_otp_resend_cooldown_seconds:
            raise VerificationRateLimitError("Please wait before requesting another code.")
        if latest is not None and _utc(latest.created_at) > now - timedelta(hours=1) and latest.resend_count >= settings.email_otp_max_resends_per_hour:
            raise VerificationRateLimitError("Too many verification emails requested. Try again later.")
        code = f"{secrets.randbelow(1_000_000):06d}"
        salt = secrets.token_hex(16)
        challenge = AuthChallenge(owner_id=owner.id, code_hash=self._code_hash(code, salt), salt=salt, expires_at=now + timedelta(minutes=settings.email_otp_ttl_minutes), created_at=now, last_sent_at=now, resend_count=(latest.resend_count + 1 if latest else 0))
        previous_challenge = latest
        if previous_challenge is not None:
            previous_challenge.consumed_at = now
        self.db.add(challenge)
        self.db.commit()
        try:
            self._deliver_verification_code(owner.email, code)
        except Exception:
            self.db.delete(challenge)
            if previous_challenge is not None:
                previous_challenge.consumed_at = None
            self.db.commit()
            raise

    def verify_email(self, email: str, code: str) -> tuple[User, str]:
        owner = self.repository.get_user_by_email(email.strip().lower())
        if owner is None:
            raise VerificationError("Invalid verification code.")
        now = datetime.now(UTC)
        challenge = self.db.scalar(select(AuthChallenge).where(AuthChallenge.owner_id == owner.id, AuthChallenge.consumed_at.is_(None)).order_by(AuthChallenge.created_at.desc()))
        settings = get_settings()
        if challenge is None or _utc(challenge.expires_at) <= now or challenge.attempts >= settings.email_otp_max_attempts:
            raise VerificationError("This verification code is invalid or expired.")
        challenge.attempts += 1
        if not secrets.compare_digest(challenge.code_hash, self._code_hash(code, challenge.salt)):
            self.db.commit()
            raise VerificationError("This verification code is invalid or expired.")
        challenge.consumed_at = now
        owner.email_verified_at = now
        self.db.commit()
        return owner, self._create_session(owner)

    def login(self, email: str, password: str) -> tuple[User, str]:
        user = self.repository.get_user_by_email(email.strip().lower())
        password_hash = user.password_hash if user is not None else DUMMY_PASSWORD_HASH
        if not verify_password(password, password_hash) or user is None:
            raise InvalidCredentialsError
        if not user.email_verified:
            raise VerificationError("Verify your email before signing in.")

        return user, self._create_session(user)

    def _create_session(self, user: User) -> str:

        now = datetime.now(UTC)
        token = create_session_token()
        expires_at = now + timedelta(hours=get_settings().auth_session_ttl_hours)
        self.repository.delete_expired_sessions(now)
        self.repository.create_session(
            owner_id=user.id,
            token_hash=hash_session_token(token),
            expires_at=expires_at,
        )
        self.db.commit()
        self.db.refresh(user)
        return token

    def get_owner_for_token(self, token: str) -> User | None:
        return self.repository.get_owner_for_active_session(
            hash_session_token(token), datetime.now(UTC)
        )

    def logout(self, token: str) -> None:
        self.repository.delete_session(hash_session_token(token))
        self.db.commit()

    def create_oauth_state(self, provider: str, owner_id: str | None = None) -> tuple[str, str]:
        settings = get_settings()
        if provider not in {"google", "github"}:
            raise OAuthError("Unsupported provider")
        client_id = settings.google_client_id if provider == "google" else settings.github_client_id
        redirect_uri = settings.google_redirect_uri if provider == "google" else settings.github_redirect_uri
        client_secret = settings.google_client_secret if provider == "google" else settings.github_client_secret
        if not client_id or not client_secret:
            raise OAuthError(f"{provider.title()} OAuth is not configured: client ID and client secret are required")
        state = secrets.token_urlsafe(32)
        now = datetime.now(UTC)
        self.db.add(AuthOAuthState(state_hash=hashlib.sha256(state.encode()).hexdigest(), provider=provider, owner_id=owner_id, expires_at=now + timedelta(minutes=10)))
        self.db.commit()
        if provider == "google":
            query = {"client_id": client_id, "redirect_uri": redirect_uri, "response_type": "code", "scope": "openid email profile", "state": state, "access_type": "online"}
            return "https://accounts.google.com/o/oauth2/v2/auth?" + urlencode(query), state
        query = {"client_id": client_id, "redirect_uri": redirect_uri, "scope": "read:user user:email", "state": state}
        return "https://github.com/login/oauth/authorize?" + urlencode(query), state

    @staticmethod
    def _get_json(url: str, *, data: dict[str, str] | None = None, headers: dict[str, str] | None = None) -> dict:
        body = urlencode(data).encode() if data is not None else None
        request = UrlRequest(url, data=body, headers=headers or {})
        try:
            with urlopen(request, timeout=10) as response:
                return json.loads(response.read().decode())
        except Exception as error:
            raise OAuthError("The identity provider could not be reached.") from error

    def finish_oauth(self, provider: str, code: str, state: str) -> tuple[User, str, bool, str]:
        if provider not in {"google", "github"}:
            raise OAuthError("Unsupported provider")
        state_record = self.db.scalar(select(AuthOAuthState).where(AuthOAuthState.state_hash == hashlib.sha256(state.encode()).hexdigest(), AuthOAuthState.provider == provider))
        now = datetime.now(UTC)
        if state_record is None or _utc(state_record.expires_at) <= now:
            raise OAuthError("Invalid or expired OAuth state.")
        self.db.delete(state_record)
        self.db.commit()
        settings = get_settings()
        if provider == "google":
            token = self._get_json("https://oauth2.googleapis.com/token", data={"code": code, "client_id": settings.google_client_id or "", "client_secret": settings.google_client_secret or "", "redirect_uri": settings.google_redirect_uri, "grant_type": "authorization_code"})
            profile = self._get_json("https://openidconnect.googleapis.com/v1/userinfo", headers={"Authorization": f"Bearer {token.get('access_token', '')}"})
            provider_id = str(profile.get("sub", "")); email = str(profile.get("email", "")).strip().lower(); verified = profile.get("email_verified") is True; full_name = profile.get("name") or email.split("@", 1)[0]
        else:
            token = self._get_json("https://github.com/login/oauth/access_token", data={"code": code, "client_id": settings.github_client_id or "", "client_secret": settings.github_client_secret or "", "redirect_uri": settings.github_redirect_uri, "accept": "json"}, headers={"Accept": "application/json"})
            access_token = token.get("access_token", "")
            profile = self._get_json("https://api.github.com/user", headers={"Authorization": f"Bearer {access_token}", "Accept": "application/vnd.github+json"})
            emails = self._get_json("https://api.github.com/user/emails", headers={"Authorization": f"Bearer {access_token}", "Accept": "application/vnd.github+json"})
            primary = next((item for item in emails if item.get("primary") and item.get("verified")), None) or next((item for item in emails if item.get("verified")), None)
            provider_id = str(profile.get("id", "")); email = str((primary or {}).get("email", "")).strip().lower(); verified = primary is not None; full_name = profile.get("name") or profile.get("login") or email.split("@", 1)[0]
        if not provider_id or not email:
            raise OAuthError("The provider did not return a usable verified identity.")
        identity = self.db.scalar(select(AuthProviderIdentity).where(AuthProviderIdentity.provider == provider, AuthProviderIdentity.provider_user_id == provider_id))
        if identity is not None:
            if state_record.owner_id is not None and identity.owner_id != state_record.owner_id:
                raise OAuthError("This provider is already linked to another account.")
            owner = self.db.get(User, identity.owner_id)
        elif state_record.owner_id is not None:
            owner = self.db.get(User, state_record.owner_id)
            if owner is None: raise OAuthError("The account could not be found.")
            if not verified or owner.email.lower() != email:
                raise OAuthError("Linking requires a verified provider identity with the same email as your account.")
            self.db.add(AuthProviderIdentity(owner_id=owner.id, provider=provider, provider_user_id=provider_id, provider_email=email))
        else:
            owner = self.repository.get_user_by_email(email)
            if owner is not None:
                raise OAuthError("An account already exists for this email. Sign in first to link this provider.")
            owner = self.repository.create_user(email=email, password_hash=DUMMY_PASSWORD_HASH, full_name=str(full_name), phone_number=None)
            owner.email_verified_at = now if verified else None
            self.db.add(AuthProviderIdentity(owner_id=owner.id, provider=provider, provider_user_id=provider_id, provider_email=email))
        self.db.commit()
        self.db.refresh(owner)
        if not owner.email_verified:
            self.send_verification_code(owner)
            raise VerificationError("Verify your email before accessing your workspace.", email=email)
        return owner, self._create_session(owner), verified, email
