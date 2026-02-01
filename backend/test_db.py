from app.database import SessionLocal
from app.models import User
from app.auth.service import get_password_hash
import uuid

# Create tables if not exist (sanity check)
# init_db() # Assuming you have an init_db or we rely on alembic. 
# We'll valid connection first.

try:
    db = SessionLocal()
    print("Database connection opened.")
    
    # Check if user exists
    user = db.query(User).filter(User.email == "test_db_script@test.com").first()
    if user:
        print("User already exists, deleting...")
        db.delete(user)
        db.commit()
        
    print("Creating user...")
    new_user = User(
        email="test_db_script@test.com",
        hashed_password=get_password_hash("password"),
        full_name="Test Script User"
    )
    db.add(new_user)
    db.commit()
    print("SUCCESS: User created in DB.")
    
    # Verify
    saved = db.query(User).filter(User.email == "test_db_script@test.com").first()
    if saved:
        print(f"Verified: {saved.id} - {saved.email}")
        
    db.close()
except Exception as e:
    print(f"FAILURE: {e}")
    # Print full traceback
    import traceback
    traceback.print_exc()
