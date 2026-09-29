from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Text,
    Integer,
    Float,
    DateTime,
    ForeignKey,
    Index,
)
from sqlalchemy.orm import relationship
from app.core.database import Base


class Career(Base):
    __tablename__ = "careers"

    id = Column(String(64), primary_key=True, index=True)
    slug = Column(String(64), unique=True, nullable=False, index=True)
    title = Column(String(128), nullable=False, index=True)
    category = Column(String(64), nullable=False, index=True)
    tagline = Column(String(255), nullable=False)
    overview = Column(Text, nullable=False)

    # At a Glance Fields
    median_pay = Column(String(128), nullable=False)
    projected_growth = Column(String(128), nullable=False)
    work_life_context = Column(Text, nullable=False)
    stress_context = Column(Text, nullable=False)

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
    responsibilities = relationship(
        "CareerResponsibility",
        back_populates="career",
        cascade="all, delete-orphan",
        order_by="CareerResponsibility.display_order",
    )
    skills = relationship(
        "CareerSkill",
        back_populates="career",
        cascade="all, delete-orphan",
        order_by="CareerSkill.display_order",
    )
    education_paths = relationship(
        "CareerEducationPath",
        back_populates="career",
        cascade="all, delete-orphan",
        order_by="CareerEducationPath.display_order",
    )
    progression = relationship(
        "CareerProgression",
        back_populates="career",
        cascade="all, delete-orphan",
        order_by="CareerProgression.display_order",
    )
    specializations = relationship(
        "CareerSpecialization",
        back_populates="career",
        cascade="all, delete-orphan",
        order_by="CareerSpecialization.display_order",
    )
    financials = relationship(
        "CareerFinancial",
        back_populates="career",
        cascade="all, delete-orphan",
        order_by="CareerFinancial.display_order",
    )
    practical_considerations = relationship(
        "CareerPracticalConsideration",
        back_populates="career",
        cascade="all, delete-orphan",
        order_by="CareerPracticalConsideration.display_order",
    )
    opportunities = relationship(
        "CareerOpportunity",
        back_populates="career",
        cascade="all, delete-orphan",
        order_by="CareerOpportunity.display_order",
    )
    pathway = relationship(
        "CareerPathway",
        back_populates="career",
        uselist=False,
        cascade="all, delete-orphan",
    )
    pathway_options = relationship(
        "PathwayOption",
        back_populates="career",
        cascade="all, delete-orphan",
    )


class CareerResponsibility(Base):
    __tablename__ = "career_responsibilities"

    id = Column(Integer, primary_key=True, autoincrement=True)
    career_id = Column(String(64), ForeignKey("careers.id", ondelete="CASCADE"), nullable=False, index=True)
    responsibility = Column(Text, nullable=False)
    display_order = Column(Integer, default=0, nullable=False)

    career = relationship("Career", back_populates="responsibilities")


class CareerSkill(Base):
    __tablename__ = "career_skills"

    id = Column(Integer, primary_key=True, autoincrement=True)
    career_id = Column(String(64), ForeignKey("careers.id", ondelete="CASCADE"), nullable=False, index=True)
    skill_name = Column(String(128), nullable=False)
    skill_type = Column(String(32), nullable=False)  # "technical" | "professional"
    importance_score = Column(Integer, default=5, nullable=False)  # 1-10
    display_order = Column(Integer, default=0, nullable=False)

    career = relationship("Career", back_populates="skills")


class CareerEducationPath(Base):
    __tablename__ = "career_education_paths"

    id = Column(Integer, primary_key=True, autoincrement=True)
    career_id = Column(String(64), ForeignKey("careers.id", ondelete="CASCADE"), nullable=False, index=True)
    phase = Column(String(32), nullable=False)  # "after_class_10" | "after_class_12" | "entrance_requirements" | "certifications"
    title = Column(String(128), nullable=False)
    description = Column(Text, nullable=False)
    duration = Column(String(64), nullable=True)
    estimated_cost = Column(String(64), nullable=True)
    display_order = Column(Integer, default=0, nullable=False)

    career = relationship("Career", back_populates="education_paths")


class CareerProgression(Base):
    __tablename__ = "career_progression"

    id = Column(Integer, primary_key=True, autoincrement=True)
    career_id = Column(String(64), ForeignKey("careers.id", ondelete="CASCADE"), nullable=False, index=True)
    level_title = Column(String(128), nullable=False)
    experience_range = Column(String(64), nullable=False)
    typical_role = Column(String(128), nullable=False)
    salary_range = Column(String(128), nullable=False)
    display_order = Column(Integer, default=0, nullable=False)

    career = relationship("Career", back_populates="progression")


class CareerSpecialization(Base):
    __tablename__ = "career_specializations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    career_id = Column(String(64), ForeignKey("careers.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(128), nullable=False)
    description = Column(Text, nullable=False)
    market_demand = Column(String(64), nullable=False)  # "High" | "Very High" | "Emerging"
    display_order = Column(Integer, default=0, nullable=False)

    career = relationship("Career", back_populates="specializations")


class CareerFinancial(Base):
    __tablename__ = "career_financials"

    id = Column(Integer, primary_key=True, autoincrement=True)
    career_id = Column(String(64), ForeignKey("careers.id", ondelete="CASCADE"), nullable=False, index=True)
    category = Column(String(32), nullable=False)  # "education_cost" | "additional_costs" | "funding_options"
    title = Column(String(128), nullable=False)
    amount_or_range = Column(String(128), nullable=False)
    notes = Column(Text, nullable=True)
    display_order = Column(Integer, default=0, nullable=False)

    career = relationship("Career", back_populates="financials")


class CareerPracticalConsideration(Base):
    __tablename__ = "career_practical_considerations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    career_id = Column(String(64), ForeignKey("careers.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(String(32), nullable=False)  # "positives" | "challenges"
    text = Column(Text, nullable=False)
    display_order = Column(Integer, default=0, nullable=False)

    career = relationship("Career", back_populates="practical_considerations")


class CareerOpportunity(Base):
    __tablename__ = "career_opportunities"

    id = Column(Integer, primary_key=True, autoincrement=True)
    career_id = Column(String(64), ForeignKey("careers.id", ondelete="CASCADE"), nullable=False, index=True)
    category = Column(String(32), nullable=False)  # "industries" | "work_models" | "geographic_options"
    name = Column(String(128), nullable=False)
    description = Column(Text, nullable=True)
    display_order = Column(Integer, default=0, nullable=False)

    career = relationship("Career", back_populates="opportunities")


class CareerPathway(Base):
    __tablename__ = "career_pathways"

    id = Column(Integer, primary_key=True, autoincrement=True)
    career_id = Column(String(64), ForeignKey("careers.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    title = Column(String(128), nullable=False)
    description = Column(Text, nullable=False)
    total_duration_years = Column(Float, nullable=False)
    total_estimated_cost = Column(String(64), nullable=False)
    expected_breakeven_years = Column(Float, nullable=False)
    difficulty_score = Column(Integer, default=5, nullable=False)  # 1-10
    nodes_json = Column(Text, nullable=False)  # JSON serialized list of PathwayFlowNode
    edges_json = Column(Text, nullable=False)  # JSON serialized list of PathwayFlowEdge

    career = relationship("Career", back_populates="pathway")
