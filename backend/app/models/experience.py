import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Text,
    Integer,
    DateTime,
    ForeignKey,
    Index,
)
from sqlalchemy.orm import relationship
from app.core.database import Base


class Experience(Base):
    __tablename__ = "experiences"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    career_id = Column(String(64), ForeignKey("careers.id", ondelete="CASCADE"), nullable=False, index=True)
    slug = Column(String(64), unique=True, nullable=False, index=True)
    title = Column(String(128), nullable=False)
    description = Column(Text, nullable=False)
    role = Column(String(64), nullable=False)
    estimated_duration = Column(String(32), nullable=False)  # e.g. "15-20 Mins"
    difficulty = Column(String(32), nullable=False)  # "Beginner" | "Intermediate" | "Advanced"
    learning_objective = Column(Text, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    career = relationship("Career")
    scenarios = relationship(
        "Scenario",
        back_populates="experience",
        cascade="all, delete-orphan",
        order_by="Scenario.sequence",
    )
    skills = relationship(
        "ExperienceSkill",
        back_populates="experience",
        cascade="all, delete-orphan",
    )
    reflections = relationship(
        "Reflection",
        back_populates="experience",
        cascade="all, delete-orphan",
        order_by="Reflection.display_order",
    )
    sessions = relationship(
        "ExperienceSession",
        back_populates="experience",
        cascade="all, delete-orphan",
    )


class Scenario(Base):
    __tablename__ = "scenarios"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    experience_id = Column(String(64), ForeignKey("experiences.id", ondelete="CASCADE"), nullable=False, index=True)
    sequence = Column(Integer, nullable=False)  # 1, 2, 3
    title = Column(String(128), nullable=False)
    situation = Column(Text, nullable=False)
    description = Column(Text, nullable=False)

    experience = relationship("Experience", back_populates="scenarios")
    evidence_items = relationship(
        "Evidence",
        back_populates="scenario",
        cascade="all, delete-orphan",
        order_by="Evidence.display_order",
    )
    decisions = relationship(
        "Decision",
        back_populates="scenario",
        cascade="all, delete-orphan",
        order_by="Decision.sequence",
    )


class Evidence(Base):
    __tablename__ = "evidence_items"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    scenario_id = Column(String(64), ForeignKey("scenarios.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(128), nullable=False)
    type = Column(String(32), nullable=False)  # "timeline" | "metric" | "log" | "status" | "chat"
    content = Column(Text, nullable=False)
    importance = Column(String(32), default="medium", nullable=False)  # "critical" | "high" | "medium" | "low"
    display_order = Column(Integer, default=0, nullable=False)

    scenario = relationship("Scenario", back_populates="evidence_items")


class Decision(Base):
    __tablename__ = "decisions"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    scenario_id = Column(String(64), ForeignKey("scenarios.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    sequence = Column(Integer, default=0, nullable=False)

    scenario = relationship("Scenario", back_populates="decisions")
    outcome = relationship(
        "DecisionOutcome",
        back_populates="decision",
        uselist=False,
        cascade="all, delete-orphan",
    )


class DecisionOutcome(Base):
    __tablename__ = "decision_outcomes"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    decision_id = Column(String(64), ForeignKey("decisions.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    title = Column(String(128), nullable=False)
    description = Column(Text, nullable=False)
    consequence = Column(Text, nullable=False)
    feedback = Column(Text, nullable=False)
    score_delta = Column(Integer, default=10, nullable=False)
    technical_score = Column(Integer, default=5, nullable=False)
    reasoning_score = Column(Integer, default=5, nullable=False)
    prioritization_score = Column(Integer, default=5, nullable=False)
    communication_score = Column(Integer, default=5, nullable=False)
    next_scenario_id = Column(String(64), nullable=True)  # null indicates completion

    decision = relationship("Decision", back_populates="outcome")


class ExperienceSkill(Base):
    __tablename__ = "experience_skills"

    id = Column(Integer, primary_key=True, autoincrement=True)
    experience_id = Column(String(64), ForeignKey("experiences.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_name = Column(String(64), nullable=False)

    experience = relationship("Experience", back_populates="skills")


class Reflection(Base):
    __tablename__ = "reflections"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    experience_id = Column(String(64), ForeignKey("experiences.id", ondelete="CASCADE"), nullable=False, index=True)
    prompt = Column(Text, nullable=False)
    category = Column(String(64), nullable=False)  # "Strategy" | "Cognitive Load" | "Self-Awareness"
    display_order = Column(Integer, default=0, nullable=False)

    experience = relationship("Experience", back_populates="reflections")


class ExperienceSession(Base):
    __tablename__ = "experience_sessions"

    id = Column(String(64), primary_key=True, default=lambda: f"sess_{uuid.uuid4().hex[:12]}", index=True)
    experience_id = Column(String(64), ForeignKey("experiences.id", ondelete="CASCADE"), nullable=False, index=True)
    current_scenario_id = Column(String(64), nullable=True)
    status = Column(String(32), default="in_progress", nullable=False)  # "not_started" | "in_progress" | "completed"
    
    # Simulation performance scores (representing specific simulation practice, NOT psychological suitability)
    total_score = Column(Integer, default=0, nullable=False)
    technical_score = Column(Integer, default=0, nullable=False)
    reasoning_score = Column(Integer, default=0, nullable=False)
    prioritization_score = Column(Integer, default=0, nullable=False)
    communication_score = Column(Integer, default=0, nullable=False)
    decisions_made = Column(Integer, default=0, nullable=False)

    started_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    completed_at = Column(DateTime(timezone=True), nullable=True)

    experience = relationship("Experience", back_populates="sessions")
    decision_logs = relationship(
        "SessionDecisionLog",
        back_populates="session",
        cascade="all, delete-orphan",
        order_by="SessionDecisionLog.created_at",
    )


class SessionDecisionLog(Base):
    __tablename__ = "session_decision_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String(64), ForeignKey("experience_sessions.id", ondelete="CASCADE"), nullable=False, index=True)
    scenario_id = Column(String(64), nullable=False)
    scenario_title = Column(String(128), nullable=False)
    decision_id = Column(String(64), nullable=False)
    decision_title = Column(String(255), nullable=False)
    outcome_title = Column(String(128), nullable=False)
    consequence = Column(Text, nullable=False)
    feedback = Column(Text, nullable=False)
    score_delta = Column(Integer, default=0, nullable=False)
    
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    session = relationship("ExperienceSession", back_populates="decision_logs")
