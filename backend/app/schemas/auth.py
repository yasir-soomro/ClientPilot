from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, SecretStr


class LoginRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    email: EmailStr
    password: SecretStr


class OwnerRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: EmailStr
    created_at: datetime
    updated_at: datetime
