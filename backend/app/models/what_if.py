import uuid
from sqlalchemy import (
    Column,
    String,
    Text,
    Float,
    Boolean,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from app.core.database import Base


class PathwayOption(Base):
    __tablename__ = "pathway_options"

    id = Column(String(64), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    career_id = Column(String(64), ForeignKey("careers.id", ondelete="CASCADE"), nullable=False, index=True)
    slug = Column(String(64), nullable=False, index=True)
    title = Column(String(128), nullable=False)
    description = Column(Text, nullable=False)
    
    # Pathway Classification & Constraints Attributes
    education_path = Column(String(32), nullable=False)  # "btech" | "bsc" | "alternative"
    estimated_duration_years = Column(Float, nullable=False)
    annual_estimated_cost = Column(Float, nullable=False)  # Numeric cost in INR for calculation
    cost_label = Column(String(128), nullable=False)  # e.g. "₹3,50,000 / yr [prototype_estimate]"
    currency = Column(String(8), default="INR", nullable=False)
    location_type = Column(String(32), nullable=False)  # "India" | "Abroad"
    study_abroad_supported = Column(Boolean, default=False, nullable=False)
    
    prerequisites = Column(String(255), nullable=False)
    next_steps = Column(String(255), nullable=False)
    
    # Graph Flow Elements
    nodes_json = Column(Text, nullable=False)
    edges_json = Column(Text, nullable=False)
    
    is_prototype_estimate = Column(Boolean, default=True, nullable=False)

    # Relationships
    career = relationship("Career", back_populates="pathway_options")
