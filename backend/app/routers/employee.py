# backend/app/routers/employee.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.services.employee import EmployeeService
from pydantic import BaseModel

router = APIRouter()

def get_db():
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker
    engine = create_engine("sqlite:///./salary_management.db", connect_args={"check_same_thread": False})
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Schema layout validation rules for inserting employees safely
class EmployeeCreateSchema(BaseModel):
    full_name: str
    job_title: str
    country: str
    salary: int

@router.get("/analytics/country")
def get_country_metrics(country: str, db: Session = Depends(get_db)):
    return EmployeeService(db).get_country_insights(country)

@router.get("/employees")
def get_paginated_roster(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    # Server-side slice pagination math: skip over previous pages chunks
    skip = (page - 1) * limit
    from app.models.employee import Employee
    total_count = db.query(Employee).count()
    records = db.query(Employee).order_by(Employee.id.desc()).offset(skip).limit(limit).all()
    
    return {
        "total": total_count,
        "page": page,
        "limit": limit,
        "data": [{"id": e.id, "full_name": e.full_name, "job_title": e.job_title, "country": e.country, "salary": e.salary} for e in records]
    }

@router.post("/employees")
def create_new_employee(payload: EmployeeCreateSchema, db: Session = Depends(get_db)):
    service = EmployeeService(db)
    return service.create_employee(payload.model_dump())

@router.delete("/employees/{employee_id}")
def delete_employee_profile(employee_id: int, db: Session = Depends(get_db)):
    from app.models.employee import Employee
    db_employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee profile not found")
    db.delete(db_employee)
    db.commit()
    return {"status": "success", "message": f"Profile {employee_id} deleted"}