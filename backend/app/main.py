# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import employee
from app.models.employee import Base
from sqlalchemy import create_engine

# --- ADD THESE TWO LINES TO AUTO-CREATE TABLES ---
engine = create_engine("sqlite:///./salary_management.db", connect_args={"check_same_thread": False})
Base.metadata.create_all(bind=engine)
# -------------------------------------------------

app = FastAPI(title="Salary Management Portal API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employee.router, prefix="/api")