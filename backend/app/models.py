from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class Scenario(Base):
    __tablename__ = "scenarios"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True)
    title = Column(String)
    description = Column(String)
    
    questions = relationship("Question", back_populates="scenario", order_by="Question.order")
    outcomes = relationship("Outcome", back_populates="scenario")

class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    scenario_id = Column(Integer, ForeignKey("scenarios.id"))
    order = Column(Integer)
    text = Column(String)
    type = Column(String)  # text, radio, checkbox
    options = Column(JSON, nullable=True)  # List of strings for radio/checkbox
    required = Column(Boolean, default=True)

    scenario = relationship("Scenario", back_populates="questions")

class Outcome(Base):
    __tablename__ = "outcomes"

    id = Column(Integer, primary_key=True, index=True)
    scenario_id = Column(Integer, ForeignKey("scenarios.id"))
    summary = Column(String)
    rights_explanation = Column(Text)
    letter_template = Column(Text) # Jinja2 template

    scenario = relationship("Scenario", back_populates="outcomes")

class UsageLog(Base):
    __tablename__ = "usage_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    event_type = Column(String) # view_scenario, generate_letter
    scenario_slug = Column(String, nullable=True)
