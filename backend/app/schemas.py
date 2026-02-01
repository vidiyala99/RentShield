from pydantic import BaseModel
from typing import List, Optional, Any

class QuestionBase(BaseModel):
    id: int
    order: int
    text: str
    type: str # text, radio, checkbox
    options: Optional[List[str]] = None
    required: bool

    class Config:
        orm_mode = True

class ScenarioBase(BaseModel):
    id: int
    slug: str
    title: str
    description: str

    class Config:
        orm_mode = True

class ScenarioDetail(ScenarioBase):
    questions: List[QuestionBase] = []

class EvaluationRequest(BaseModel):
    answers: dict

class EvaluationResponse(BaseModel):
    outcome_summary: str
    rights_explanation: str
    letter_text: str
    advocate_report: str = None
