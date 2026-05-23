# backend/tests/test_employee_router.py
import pytest
from app.models.employee import Employee

def test_api_returns_correct_country_analytics(client, db_session):
    # Arrange: Add mock employees to the shared isolated test session instance
    db_session.add_all([
        Employee(full_name="John Doe", job_title="Developer", country="India", salary=50000),
        Employee(full_name="Jane Smith", job_title="Manager", country="India", salary=150000),
    ])
    db_session.commit()

    # Act: Request analytics data via the HTTP GET endpoint using the isolated client
    response = client.get("/api/analytics/country?country=India")

    # Assert: Validate response structure and data matches exactly
    assert response.status_code == 200
    data = response.json()
    assert data["min_salary"] == 50000
    assert data["max_salary"] == 150000
    assert data["avg_salary"] == 100000