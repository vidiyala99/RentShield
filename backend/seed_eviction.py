from sqlalchemy.orm import Session
from app.database import SessionLocal, engine
from app.models import Base, Scenario, Question, Outcome
import json

def seed_eviction():
    db = SessionLocal()
    
    # Check if data exists
    if db.query(Scenario).filter(Scenario.slug == "eviction").first():
        print("Eviction scenario already seeded.")
        return

    # Eviction Scenario
    eviction = Scenario(
        slug="eviction",
        title="Eviction (Non-Payment)",
        description="Received a 10-day notice or court papers? Check if you can stop the eviction or assert defenses."
    )
    db.add(eviction)
    db.commit()

    q1 = Question(
        scenario_id=eviction.id,
        order=1,
        text="Have you received a '10-Day Notice to Quit' from your landlord?",
        type="radio",
        options=["Yes", "No"],
        required=True
    )
    
    q2 = Question(
        scenario_id=eviction.id,
        order=2,
        text="Have you received court papers (Summary Ejectment Complaint)?",
        type="radio",
        options=["Yes", "No"],
        required=True
    )

    q3 = Question(
        scenario_id=eviction.id,
        order=3,
        text="Are there unaddressed repairs or unsafe conditions in your home?",
        type="checkbox",
        options=["No Heat/AC", "Mold/Water Damage", "Pests", "Plumbing", "Electrical", "None"],
        required=True
    )

    q4 = Question(
        scenario_id=eviction.id,
        order=4,
        text="Do you have the ability to pay the full rent owed plus court costs (Tender of Rent)?",
        type="radio",
        options=["Yes, I have it now", "No, I cannot pay right now"],
        required=True
    )

    db.add_all([q1, q2, q3, q4])
    
    db.commit()
    print("Eviction seeding complete!")
    db.close()

if __name__ == "__main__":
    seed_eviction()
