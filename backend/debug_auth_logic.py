from app.database import SessionLocal
from app.models import User
from app.auth.service import get_password_hash, create_access_token, create_refresh_token
from app.schemas import UserCreate
import traceback

try:
    db = SessionLocal()
    print("DB Connected")
    
    email = "debug_auth@test.com"
    password = "password"
    full_name = "Debug User"
    
    # Clean up
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        db.delete(existing)
        db.commit()
    
    print("Creating User Obj...")
    user = User(
        email=email,
        hashed_password=get_password_hash(password),
        full_name=full_name
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    print("User Committed")
    
    print("Creating Tokens...")
    access = create_access_token({"sub": str(user.id)})
    print(f"Access Token: {access[:10]}...")
    
    refresh = create_refresh_token({"sub": str(user.id)})
    print(f"Refresh Token: {refresh[:10]}...")
    
    print("SUCCESS: Auth Logic Complete")

except Exception as e:
    print(f"FAILURE: {e}")
    traceback.print_exc()
