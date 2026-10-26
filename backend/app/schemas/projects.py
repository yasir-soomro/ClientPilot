from datetime import date, datetime
import re
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, field_validator, model_validator

ProjectStatus = Literal["planned", "in_progress", "completed"]


def _validate_due_date_input(value: object) -> object:
    if value is None:
        return None
    if (
        not isinstance(value, str)
        or re.fullmatch(r"[0-9]{4}-[0-9]{2}-[0-9]{2}", value) is None
    ):
        raise ValueError("Due date must use YYYY-MM-DD format.")
    try:
        date.fromisoformat(value)
    except ValueError as error:
        raise ValueError("Due date must use YYYY-MM-DD format.") from error
    return value


class ProjectCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    client_id: UUID
    name: str
    status: ProjectStatus = "planned"
    due_date: date | None = None

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Name must not be blank.")
        if len(value) > 255:
            raise ValueError("Name must be at most 255 characters.")
        return value

    @field_validator("due_date", mode="before")
    @classmethod
    def validate_due_date(cls, value: object) -> object:
        return _validate_due_date_input(value)


class ProjectUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    name: str | None = None
    client_id: UUID | None = None
    status: ProjectStatus | None = None
    due_date: date | None = None

    @model_validator(mode="after")
    def require_an_update(self) -> "ProjectUpdate":
        if not self.model_fields_set:
            raise ValueError("At least one project field must be provided.")
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

    @field_validator("client_id")
    @classmethod
    def validate_client_id(cls, value: UUID | None) -> UUID:
        if value is None:
            raise ValueError("Client ID cannot be null.")
        return value

    @field_validator("status")
    @classmethod
    def validate_status(cls, value: ProjectStatus | None) -> ProjectStatus:
        if value is None:
            raise ValueError("Status cannot be null.")
        return value

    @field_validator("due_date", mode="before")
    @classmethod
    def validate_due_date(cls, value: object) -> object:
        return _validate_due_date_input(value)


class ProjectRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    client_id: UUID
    name: str
    status: ProjectStatus
    due_date: date | None
    created_at: datetime
    updated_at: datetime
