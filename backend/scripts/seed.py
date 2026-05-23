# backend/scripts/seed.py
import random
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.employee import Base, Employee

# Connect to our local SQLite database file
DATABASE_URL = "sqlite:///./salary_management.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)

def seed_database():
    print("⏳ Initializing database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if we already have data so we don't duplicate it
    if db.query(Employee).count() > 0:
        print("✅ Database already has records. Skipping seed.")
        db.close()
        return

    print("🌱 Generating 10,000 highly diversified employee profiles...")
    
    # Pools to cross-multiply names, roles, and regions realistically
    first_names = ["Arun", "Priya", "Rahul", "Sarah", "John", "Michael", "David", "Deepak", "Elena", "Kamil"]
    last_names = ["Kumar", "Sharma", "Smith", "Johnson", "Patel", "Das", "Müller", "Devi", "García", "Ali"]
    jobs = ["Software Engineer", "Senior Software Engineer", "Data Scientist", "Product Manager", "QA Engineer", "HR Specialist", "DevOps Engineer", "UI/UX Designer"]
    countries = ["India", "United States", "United Kingdom", "Germany", "Canada"]

    employees = []
    for _ in range(10000):
        name = f"{random.choice(first_names)} {random.choice(last_names)}"
        job = random.choice(jobs)
        country = random.choice(countries)
        
        # Give different salary bands per country for realistic data aggregations
        if country == "United States":
            salary = random.randint(80000, 180000)
        elif country == "India":
            salary = random.randint(40000, 150000)  # normalized scale for testing
        else:
            salary = random.randint(60000, 140000)

        employees.append(
            Employee(full_name=name, job_title=job, country=country, salary=salary)
        )

    # Use fast bulk save to insert all 10,000 items in milliseconds
    db.bulk_save_objects(employees)
    db.commit()
    print(f"🚀 Successfully seeded {db.query(Employee).count()} records into your local roster file!")
    db.close()

if __name__ == "__main__":
    seed_database()