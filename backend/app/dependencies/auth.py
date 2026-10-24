from typing import Annotated

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.services.auth_service import AuthService


def get_current_user(
    request: Request, db: Annotated[Session, Depends(get_db)]
) -> User:
    token = request.cookies.get("clientpilot_session")
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
        )

    owner = AuthService(db).get_owner_for_token(token)
    if owner is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
        )
    return owner


CurrentUser = Annotated[User, Depends(get_current_user)]
