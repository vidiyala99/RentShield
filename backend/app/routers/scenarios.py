from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, database
from .. import models, schemas, database
from ..services import decision_engine, template_engine, analytics

router = APIRouter(
    prefix="/scenarios",
    tags=["scenarios"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[schemas.ScenarioBase])
def read_scenarios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    scenarios = db.query(models.Scenario).offset(skip).limit(limit).all()
    return scenarios

@router.get("/{scenario_id}", response_model=schemas.ScenarioDetail)
def read_scenario(scenario_id: int, db: Session = Depends(get_db)):
    scenario = db.query(models.Scenario).filter(models.Scenario.id == scenario_id).first()
    if scenario is None:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return scenario

@router.get("/{scenario_id}/questions", response_model=List[schemas.QuestionBase])
def read_scenario_questions(scenario_id: int, db: Session = Depends(get_db)):
    scenario = db.query(models.Scenario).filter(models.Scenario.id == scenario_id).first()
    if scenario is None:
        raise HTTPException(status_code=404, detail="Scenario not found")
        
    # Log Scenario Started
    analytics.log_event(db, "view_scenario", scenario.slug)

    return scenario.questions

@router.post("/{scenario_id}/evaluate", response_model=schemas.EvaluationResponse)
def evaluate_scenario_endpoint(scenario_id: int, request: schemas.EvaluationRequest, db: Session = Depends(get_db)):
    scenario = db.query(models.Scenario).filter(models.Scenario.id == scenario_id).first()
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")
    
    # Run Decision Engine
    result = decision_engine.evaluate_scenario(scenario.slug, request.answers)
    
    # Log Letter Generated
    analytics.log_event(db, "generate_letter", scenario.slug)
    
    # Generate Letter
    if result.get("template_name"):
        letter = template_engine.render_template(result["template_name"], result["context"])
    else:
        letter = "No letter generated for this outcome."
        
    return schemas.EvaluationResponse(
        outcome_summary=result["outcome_summary"],
        rights_explanation=result["rights_explanation"],
        letter_text=letter,
        advocate_report=result.get("advocate_report", "No report available.")
    )

