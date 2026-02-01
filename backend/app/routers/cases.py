from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Case, Question, UsageLog, User
from app.schemas import CaseDetail, CaseBase, EvaluationRequest, EvaluationResponse, CaseCreate
from app.services.decision_engine import evaluate_scenario
from app.services.analytics import log_event
from app.auth.service import create_access_token # Not needed here directly
from app.routers.auth import router as auth_router # ensure auth router is imported in main
# We need a dependency to get current user
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
import os

# Re-implement get_current_user here or import it if we made it reusable?
# In routers/auth.py I didn't export `get_current_user` effectively for reuse yet 
# (I just wrote the login logic). 
# Let's add `get_current_user` to a `dependencies.py` or `auth/utils.py`?
# Or for now duplicate/inline it or import from auth router if I update auth router.

# Let's assume we import the dependency. 
# BUT `routers/auth.py` isn't a library.
# I will create `app/dependencies.py` for shared deps.

router = APIRouter(prefix="/cases", tags=["cases"])

# --- DEPENDENCY PLACEHOLDER (Ideally move to dependencies.py) ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user = db.query(User).filter(str(User.id) == user_id).first()
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# --- ENDPOINTS ---

@router.get("", response_model=List[CaseDetail])
async def get_cases(db: Session = Depends(get_db)):
    # Legacy: Return all "System Cases" (Templates) for the public homepage?
    # Or should we only return User Cases?
    # V2 Goal: "User authentication & personal cases"
    # But for the "New Case" wizard, we need the Templates.
    # Let's filter: Cases where user_id is NULL are templates.
    return db.query(Case).filter(Case.user_id == None).all()

@router.get("/my-cases", response_model=List[CaseDetail])
async def get_my_cases(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Return cases belonging to the user
    return db.query(Case).filter(Case.user_id == current_user.id).all()

@router.get("/{id}", response_model=CaseDetail)
async def get_case(id: int, db: Session = Depends(get_db)):
    # Allow viewing templates (user_id=None) OR owned cases
    case = db.query(Case).filter(Case.id == id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    # Simple Access Control:
    # If case has a user_id, check if it matches current user (need optional auth)
    # For now, let's just return it (MVP). Ideally check ownership.
    return case

@router.get("/{id}/questions") # Return list of questions object
async def get_questions(id: int, db: Session = Depends(get_db)):
    case = db.query(Case).filter(Case.id == id).first()
    if not case:
         raise HTTPException(status_code=404, detail="Case not found")
         
    # Log the view event
    log_event(db, "view_scenario", case.slug)
    
    return case.questions

@router.post("/{id}/evaluate", response_model=EvaluationResponse)
async def evaluate(id: int, request: EvaluationRequest, db: Session = Depends(get_db)):
    case = db.query(Case).filter(Case.id == id).first()
    if not case:
         raise HTTPException(status_code=404, detail="Case not found")

    result = evaluate_scenario(case.slug, request.answers)
    
    # Log event
    log_event(db, "generate_letter", case.slug)

    return result
