# backend/app/models/employee.py
from sqlalchemy import Column, Integer, String, Float, Index
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    job_title = Column(String, nullable=False, index=True)
    country = Column(String, nullable=False, index=True)
    salary = Column(Float, nullable=False)
    department = Column(String, nullable=True)

    # Performance optimization indexes for the 10k analytics queries
    __table_args__ = (
        Index('ix_employee_country_salary', 'country', 'salary'),
        Index('ix_employee_country_job_salary', 'country', 'job_title', 'salary'),
    )