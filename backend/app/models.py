from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, DateTime, JSON
from sqlalchemy.orm import relationship, Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from app.database import Base
from datetime import datetime
import uuid

# Helper to support both SQLite (dev) and Postgres (prod) UUIDs if needed
# For now, we will use strings/GUID logic or strict UUID if staying on Postgres.
# Since the plan is to migrate to Postgres, we can use UUID(as_uuid=True).
# However, SQLAlchemy's UUID type is preferred in 2.0.

from sqlalchemy import Uuid

class User(Base):
    __tablename__ = "users"
    
    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    phone = Column(String(20))
    address = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    cases = relationship("Case", back_populates="user")

class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True) # Keeping slug for now for legacy compatibility or scenario type
    title = Column(String, index=True)
    description = Column(String)
    
    # New fields for Case Management
    user_id = Column(Uuid(as_uuid=True), ForeignKey("users.id"), nullable=True) # Nullable for now to allow seeding generic templates? Or make generic scenarios separate?
    # The plan says "Rename 'scenarios' table to 'cases' (more accurate for user-specific issues)"
    # BUT we had "templates" of scenarios.
    # Approach: 
    # 1. We might keep generic "ScenarioTemplates" and "UserCases".
    # OR 2. The user's plan implies "Scenario" becomes "Case".
    # "Rename 'scenarios' table to 'cases' ... Add user_id to cases"
    # This implies the *instances* of issues are now Cases.
    # What about the generic data (Questions)? Questions need to belong to a Case Type?
    # Actually, often `Scenario` was the definition (Repairs).
    # If we rename `Scenario` to `Case`, then "Repairs" becomes a Case?
    # No, usually we have `Scenario` (Definition) and `Case` (Instance).
    # BUT the user instruction says: "Rename 'scenarios' table to 'cases'".
    # Let's follow the user plan STRICTLY.
    # "Rename 'scenarios' table to 'cases' ... Add user_id ... Add title, description..."
    # Existing `Scenario` had: id, slug, title, description.
    # Questions were linked to Scenario.
    # If `Case` replaces `Scenario`, then Questions link to `Case`.
    # This means `Case` acts as the Template AND the Instance? That's messy.
    # BETTER INTERPRETATION:
    # `Scenario` (the template) should probably stay or be "CaseType".
    # `Case` (the user instance).
    # However, the migration provided by user: `op.rename_table('scenarios', 'cases')`
    # This suggests the user WANTS to convert existing Scenarios into Cases.
    # And then add `user_id` (nullable).
    # So the "Templates" become "System Cases" (user_id=None).
    # And User Cases are new rows (user_id=user).
    # Check seed logic: `Question` links to `scenario_id`.
    # So if we rename, `Question` links to `case_id`.
    
    case_type = Column(String(50)) # To store 'repairs', 'deposit', etc.
    status = Column(String(50), default='open')
    landlord_name = Column(String(255))
    landlord_email = Column(String(255))
    property_address = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="cases")
    # outcomes = relationship("Outcome", back_populates="case") # Outcome might be linked to Template?
    # For MVP V2, let's keep Questions linked to "Cases" (where some cases are templates).

    # questions relation:
    # If `Case` is a user instance, it shouldn't have `Questions` defining the form.
    # The `Questions` define the FORM STRUCTURE.
    # So `Questions` should belong to a `Scenario` (Template).
    # Only `Answers` belong to a `Case`.
    
    # CRITICAL DEVIATION CHECK:
    # User plan: "Rename 'scenarios' table to 'cases'".
    # This is slightly dangerous if not handled well.
    # Let's assume the "System Cases" (slug='repairs') hold the Questions.
    # And "User Cases" (user_id=123) hold the Answers/Messages.
    # So we need a `parent_slug` or `case_type` on User Cases to know which Questions to ask.
    
    # Let's keep existing fields for compatibility + new fields.

    questions = relationship("Question", back_populates="case")
    logs = relationship("UsageLog", back_populates="case")
    photos = relationship("CasePhoto", back_populates="case")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    scenario_id = Column(Integer, ForeignKey("cases.id")) # renamed table, but FK usually points to table name? SQLAlchemy uses class name or table name in ForeignKey. "cases.id" is table.
    order = Column(Integer)
    text = Column(String)
    type = Column(String) # text, radio, checkbox
    options = Column(JSON, nullable=True) # Store options as JSON array
    required = Column(Boolean, default=True)

    case = relationship("Case", back_populates="questions")

class Outcome(Base):
    __tablename__ = "outcomes"

    id = Column(Integer, primary_key=True, index=True)
    scenario_id = Column(Integer, ForeignKey("cases.id"))
    logic_code = Column(String) # Placeholder for logic ID
    title = Column(String)
    content = Column(String)

    # case = relationship("Case", back_populates="outcomes")

class UsageLog(Base):
    __tablename__ = "usage_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    event_type = Column(String) # view_scenario, generate_letter
    scenario_id = Column(Integer, ForeignKey("cases.id"), nullable=True)
    # or just store slug if we want decoupled logging
    scenario_slug = Column(String, nullable=True)
    
    case = relationship("Case", back_populates="logs")

class CasePhoto(Base):
    __tablename__ = "case_photos"

    id = Column(Uuid(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    file_path = Column(String, nullable=False)
    analysis_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    case = relationship("Case", back_populates="photos")
