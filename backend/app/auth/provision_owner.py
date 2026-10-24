import argparse
from getpass import getpass

from pydantic import EmailStr, TypeAdapter, ValidationError
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.services.auth_service import AuthService, DuplicateOwnerError


def provision_owner(db: Session, email: str, password: str) -> None:
    AuthService(db).provision_owner(email, password)


def main() -> None:
    parser = argparse.ArgumentParser(description="Provision a ClientPilot owner account.")
    parser.add_argument("--email", required=True)
    args = parser.parse_args()
    try:
        email = str(TypeAdapter(EmailStr).validate_python(args.email))
    except ValidationError as exc:
        parser.error(f"Invalid email address: {exc.errors()[0]['msg']}")

    password = getpass("Owner password (12-128 characters): ")
    confirmation = getpass("Confirm owner password: ")
    if password != confirmation:
        parser.error("Passwords do not match.")
    if not 12 <= len(password) <= 128:
        parser.error("Password must be between 12 and 128 characters.")

    db = SessionLocal()
    try:
        try:
            provision_owner(db, email, password)
        except DuplicateOwnerError as exc:
            parser.error(str(exc))
    finally:
        db.close()
    print("Owner account provisioned.")


if __name__ == "__main__":
    main()
