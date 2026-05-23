# backend/app/routers/employee.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services.employee import EmployeeService
from app.models.employee import Base

router = APIRouter()

# Simple dependency to retrieve a live database session
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

@router.get("/analytics/country")
def get_country_metrics(country: str, db: Session = Depends(get_db)):
    service = EmployeeService(db)
    return service.get_country_insights(country)