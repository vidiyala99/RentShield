from app.schemas import Token, UserResponse
from app.models import User
from app.database import SessionLocal, Base
from sqlalchemy import Column, String, Boolean
from sqlalchemy import Uuid # Import Uuid matching models.py
import uuid
import traceback

try:
    # Create a dummy user object mimicking the ORM object
    # Or fetch from DB to be authentic
    db = SessionLocal()
    user_orm = db.query(User).filter(User.email == "router_debug@test.com").first()
    
    if not user_orm:
        print("User not found, creating dummy...")
        user_orm = User(
            id=uuid.uuid4(),
            email="pydantic_test@test.com",
            full_name="Pydantic Tester",
            hashed_password="hash",
            is_active=True
        )
    
    print(f"User ORM ID: {user_orm.id} (type: {type(user_orm.id)})")
    
    token_dict = {
        "access_token": "fake-token",
        "token_type": "bearer",
        "user": user_orm
    }
    
    print("Validating against Token schema...")
    token_model = Token.model_validate(token_dict)
    print("Validation SUCCESS!")
    print(token_model.model_dump())

except Exception as e:
    print(f"Validation FAILURE: {e}")
    traceback.print_exc()
