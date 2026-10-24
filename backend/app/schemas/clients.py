from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, field_validator, model_validator


class ClientCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str
    email: EmailStr | None = None
    company: str | None = None

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Name must not be blank.")
        if len(value) > 255:
            raise ValueError("Name must be at most 255 characters.")
        return value

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: EmailStr | None) -> str | None:
        return str(value).strip().lower() if value is not None else None

    @field_validator("company")
    @classmethod
    def normalize_company(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        if len(value) > 255:
            raise ValueError("Company must be at most 255 characters.")
        return value or None


class ClientUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str | None = None
    email: EmailStr | None = None
    company: str | None = None

    @model_validator(mode="after")
    def require_an_update(self) -> "ClientUpdate":
        if not self.model_fields_set:
            raise ValueError("At least one client field must be provided.")
        return self

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str | None) -> str | None:
        if value is None:
            raise ValueError("Name cannot be null.")
        value = value.strip()
        if not value:
            raise ValueError("Name must not be blank.")
        if len(value) > 255:
            raise ValueError("Name must be at most 255 characters.")
        return value

    @field_validator("email")
    @classmethod
    def normalize_email(cls, value: EmailStr | None) -> str | None:
        return str(value).strip().lower() if value is not None else None

    @field_validator("company")
    @classmethod
    def normalize_company(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        if len(value) > 255:
            raise ValueError("Company must be at most 255 characters.")
        return value or None


class ClientRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    email: EmailStr | None
    company: str | None
    created_at: datetime
    updated_at: datetime
