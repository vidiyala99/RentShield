from sqlalchemy.orm import Session
from .. import models

def log_event(db: Session, event_type: str, scenario_slug: str = None):
    try:
        log = models.UsageLog(event_type=event_type, scenario_slug=scenario_slug)
        db.add(log)
        db.commit()
    except Exception as e:
        print(f"Error logging event: {e}")
        # Don't fail the request if logging fails
        db.rollback()
