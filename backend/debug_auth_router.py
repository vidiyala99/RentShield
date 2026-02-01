from app.routers.auth import register
from app.schemas import UserCreate
from app.database import SessionLocal
import asyncio
import traceback

async def main():
    try:
        db = SessionLocal()
        print("DB Connected")
        
        user_in = UserCreate(
            email="router_debug@test.com",
            password="password",
            full_name="Router Debugger"
        )
        
        # Clean up previous run
        # We need to import User from models to clean up
        from app.models import User
        existing = db.query(User).filter(User.email == user_in.email).first()
        if existing:
            db.delete(existing)
            db.commit()
            print("Cleaned up existing user")

        print("Calling register function...")
        # Since it's an async function, await it
        result = await register(user_in, db)
        
        print("Result received:")
        print(result)
        
        print("SUCCESS: Register function worked")
        db.close()
        
    except Exception as e:
        print(f"FAILURE: {e}")
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
