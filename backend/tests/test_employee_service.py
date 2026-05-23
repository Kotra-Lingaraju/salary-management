# backend/tests/test_employee_service.py
import pytest
from app.services.employee import EmployeeService

def test_create_employee_saves_successfully(db_session):
    # Arrange: Setup service with our test in-memory database session
    service = EmployeeService(db_session)
    employee_data = {
        "full_name": "Kotra Craftsperson",
        "job_title": "Python Engineer",
        "country": "India",
        "salary": 120000.0,
        "department": "Engineering"
    }
    
    # Act: Attempt to create the employee
    new_emp = service.create_employee(employee_data)
    
    # Assert: Verify it saved correctly and generated a unique ID
    assert new_emp.id is not None
    assert new_emp.full_name == "Kotra Craftsperson"
    assert new_emp.salary == 120000.0