# backend/app/services/employee.py
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.employee import Employee

class EmployeeService:
    def __init__(self, db: Session):
        self.db = db

    def create_employee(self, data: dict) -> Employee:
        db_employee = Employee(**data)
        self.db.add(db_employee)
        self.db.commit()
        self.db.refresh(db_employee)
        return db_employee

    def get_country_insights(self, country: str) -> dict:
        # Run optimized SQL aggregations across our dataset
        result = self.db.query(
            func.min(Employee.salary).label("min_salary"),
            func.max(Employee.salary).label("max_salary"),
            func.avg(Employee.salary).label("avg_salary")
        ).filter(Employee.country == country).first()
        
        return {
            "min_salary": result.min_salary or 0,
            "max_salary": result.max_salary or 0,
            "avg_salary": round(result.avg_salary or 0, 2) if result.avg_salary else 0
        }