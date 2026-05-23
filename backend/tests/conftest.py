# backend/tests/conftest.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from app.models.employee import Base
from app.routers.employee import get_db
from app.main import app

# Use StaticPool to ensure all threads and routes share the same memory space
test_engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

@pytest.fixture(name="db_session", scope="function")
def fixture_db_session():
    # Build clean table schemas dynamically for the scope of the test execution
    Base.metadata.create_all(bind=test_engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        # Wipe database completely clean to ensure total test isolation
        Base.metadata.drop_all(bind=test_engine)

@pytest.fixture(name="client", scope="function")
def fixture_client(db_session):
    # This dependency override intercepts your route logic and forces it to use the test session
    app.dependency_overrides[get_db] = lambda: db_session
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()