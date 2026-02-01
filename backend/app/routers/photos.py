from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from typing import List
from app.database import SessionLocal
from app.models import User, Case, CasePhoto
from app.schemas import CasePhotoResponse, CasePhotoBase
from app.routers.auth import get_current_user
from app.services.storage import get_storage_service, StorageService
import uuid

router = APIRouter(
    prefix="/cases",
    tags=["photos"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/{case_id}/photos", response_model=CasePhotoResponse)
async def upload_case_photo(
    case_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Verify case ownership
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    # In V2, assume cases belong to users or are public templates?
    # If case has user_id, check ownership
    if case.user_id and str(case.user_id) != str(current_user.id):
         raise HTTPException(status_code=403, detail="Not authorized to modify this case")

    # Upload file
    storage: StorageService = get_storage_service()
    file_path = await storage.upload_file(file)
    
    # Create DB record
    new_photo = CasePhoto(
        case_id=case_id,
        file_path=file_path,
        analysis_json={} # AI analysis to be added later
    )
    
    db.add(new_photo)
    db.commit()
    db.refresh(new_photo)
    
    return new_photo

@router.get("/{case_id}/photos", response_model=List[CasePhotoResponse])
def get_case_photos(
    case_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    if case.user_id and str(case.user_id) != str(current_user.id):
         raise HTTPException(status_code=403, detail="Not authorized")

    return db.query(CasePhoto).filter(CasePhoto.case_id == case_id).all()
