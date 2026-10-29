from datetime import datetime
import re
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, SecretStr, field_validator


class LoginRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    email: EmailStr
    password: SecretStr


class RegisterRequest(LoginRequest):
    full_name: str
    phone_number: str

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Full name must not be blank.")
        if len(value) > 50:
            raise ValueError("Full name must be at most 50 characters.")
        return value

    @field_validator("password")
    @classmethod
    def validate_password_length(cls, value: SecretStr) -> SecretStr:
        password = value.get_secret_value()
        if not 12 <= len(password) <= 128:
            raise ValueError("Password must be between 12 and 128 characters.")
        return value

    @field_validator("phone_number")
    @classmethod
    def validate_phone_number(cls, value: str) -> str:
        value = value.strip()
        if re.fullmatch(r"\+[1-9][0-9]{6,14}", value) is None:
            raise ValueError(
                "Phone number must use international E.164 format, "
                "for example +14155552671."
            )
        return value


class OwnerRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: EmailStr
    full_name: str | None
    phone_number: str | None
    email_verified: bool
    created_at: datetime
    updated_at: datetime
