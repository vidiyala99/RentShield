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
class QuestionBase(BaseModel):
    id: int
    text: str
    type: str
    options: Optional[List[str]] = None
    required: bool
    
    class Config:
        from_attributes = True

class CasePhotoBase(BaseModel):
    file_path: str
    analysis_json: Optional[dict] = None

class CasePhotoResponse(CasePhotoBase):
    id: uuid.UUID
    created_at: datetime
    
    class Config:
        from_attributes = True

class CaseBase(BaseModel): 
    slug: str
    title: str
    description: str
    case_type: Optional[str] = None

class CaseCreate(BaseModel):
    case_type: str
    title: Optional[str] = None
    description: Optional[str] = None

class CaseDetail(CaseBase):
    id: int
    questions: List[QuestionBase] = []
    photos: List[CasePhotoResponse] = [] # Added photos list
    
    class Config:
        from_attributes = True

class Answer(BaseModel):
    question_id: str 
    value: Any

class EvaluationRequest(BaseModel):
    answers: dict

class EvaluationResponse(BaseModel):
    outcome_summary: str
    rights_explanation: str
    letter_text: str
    advocate_report: Optional[str] = None
