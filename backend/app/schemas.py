from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime
import uuid

# --- AUTH SCHEMAS ---
class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: uuid.UUID
    is_active: bool
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    user_id: Optional[str] = None

# --- CASE/SCENARIO SCHEMAS ---
# Renaming Scenario schemas to Case schemas conceptually, but keeping names if backend uses them
# The frontend expects "ScenarioBase" etc.
# We can alias them or just rename. Let's rename for consistency with Backend v2.

class QuestionBase(BaseModel):
    id: int
    text: str
    type: str
    options: Optional[List[str]] = None
    required: bool
    
    class Config:
        from_attributes = True

class CaseBase(BaseModel): # Was ScenarioBase
    slug: str
    title: str
    description: str
    case_type: Optional[str] = None # Added for V2

class CaseCreate(CaseBase):
    pass

class CaseDetail(CaseBase):
    id: int
    questions: List[QuestionBase] = []
    
    class Config:
        from_attributes = True

class Answer(BaseModel):
    question_id: str # "q_1"
    value: Any

class EvaluationRequest(BaseModel):
    answers: dict

class EvaluationResponse(BaseModel):
    outcome_summary: str
    rights_explanation: str
    letter_text: str
    advocate_report: Optional[str] = None
