from datetime import date, datetime
import re
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, field_validator

TaskStatus = Literal["todo", "in_progress", "done"]


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


class TaskCreate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    title: str
    description: str | None = None
    due_date: date | None = None
    status: TaskStatus = "todo"

    @field_validator("title")
    @classmethod
    def validate_title(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Title must not be blank.")
        if len(value) > 255:
            raise ValueError("Title must be at most 255 characters.")
        return value

    @field_validator("description")
    @classmethod
    def validate_description(cls, value: str | None) -> str | None:
        if value is None:
            return None
        value = value.strip()
        if len(value) > 5000:
            raise ValueError("Description must be at most 5000 characters.")
        return value or None

    @field_validator("due_date", mode="before")
    @classmethod
    def validate_due_date(cls, value: object) -> object:
        return _validate_due_date_input(value)


class TaskStatusUpdate(BaseModel):
    model_config = ConfigDict(extra="forbid")

    status: TaskStatus


class TaskRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    project_id: UUID
    title: str
    description: str | None
    due_date: date | None
    status: TaskStatus
    created_at: datetime
    updated_at: datetime
