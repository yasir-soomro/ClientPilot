from app.main import app


def test_application_metadata() -> None:
    assert app.title == "ClientPilot API"
    assert app.version == "0.1.0"
