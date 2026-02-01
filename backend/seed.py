from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import Base, Scenario, Question, Outcome
import json

# Create tables if not exist (fallback if alembic fails)
# Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    
    # Check if data exists
    if db.query(Scenario).count() > 0:
        print("Data already seeded.")
        return

    # 1. Repairs Scenario
    repairs = Scenario(
        slug="repairs",
        title="Repairs & Maintenance",
        description="Landlord won't fix the mold or broken heater? Generate a formal demand letter citing NC statutes."
    )
    db.add(repairs)
    db.commit()

    q1 = Question(
        scenario_id=repairs.id,
        order=1,
        text="What is the issue requiring repair?",
        type="checkbox",
        options=["No Heat/AC", "Mold/Water Damage", "Broken Lock/Security", "Pest Infestation", "Plumbing Issue"],
        required=True
    )
    q2 = Question(
        scenario_id=repairs.id,
        order=2,
        text="Have you notified the landlord previously?",
        type="radio",
        options=["Yes, in writing", "Yes, verbally", "No"],
        required=True
    )
    q3 = Question(
        scenario_id=repairs.id,
        order=3,
        text="How long has this been an issue?",
        type="text",
        required=True
    )
    db.add_all([q1, q2, q3])

    # 2. Security Deposit Scenario
    deposit = Scenario(
        slug="deposit",
        title="Security Deposit",
        description="Moved out and didn't get your deposit back? Create a dispute letter to get your money."
    )
    db.add(deposit)
    db.commit()

    d1 = Question(
        scenario_id=deposit.id,
        order=1,
        text="How long has it been since you moved out?",
        type="radio",
        options=["Less than 30 days", "More than 30 days"],
        required=True
    )
    d2 = Question(
        scenario_id=deposit.id,
        order=2,
        text="Did you provide a forwarding address?",
        type="radio",
        options=["Yes", "No"],
        required=True
    )
    db.add_all([d1, d2])
    
    db.commit()
    print("Seeding complete!")
    db.close()

if __name__ == "__main__":
    seed_data()
