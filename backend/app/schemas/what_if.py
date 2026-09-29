from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict, Field
from app.schemas.career import PathwayNodeSchema, PathwayEdgeSchema, CareerPathwayResponse


class EducationPathEnum(str, Enum):
    BTECH = "btech"
    BSC = "bsc"
    ALTERNATIVE = "alternative"


class LocationEnum(str, Enum):
    INDIA = "India"
    ABROAD = "Abroad"


class WhatIfRequest(BaseModel):
    education_budget: float = Field(
        ...,
        ge=0,
        description="Annual education budget in preferred currency (must be >= 0)",
        examples=[200000.0, 500000.0],
    )
    currency: str = Field(
        default="INR",
        description="Currency code (e.g. INR, USD)",
        examples=["INR"],
    )
    preferred_location: LocationEnum = Field(
        default=LocationEnum.INDIA,
        description="Target geographic location: India or Abroad",
    )
    education_path: EducationPathEnum = Field(
        ...,
        description="Preferred education model: btech, bsc, or alternative",
    )
    study_abroad: bool = Field(
        default=False,
        description="Set to true if open to international degree programs",
    )


class PathwayOptionSchema(BaseModel):
    id: str
    title: str
    description: str
    education_path: str
    estimated_duration_years: float
    annual_estimated_cost: float
    cost_label: str
    currency: str
    location_type: str
    study_abroad_supported: bool
    prerequisites: str
    next_steps: str
    is_prototype_estimate: bool = True
    nodes: List[PathwayNodeSchema] = Field(default_factory=list)
    edges: List[PathwayEdgeSchema] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)


class PathwayChangeExplanationSchema(BaseModel):
    pathway_id: str
    pathway_title: str
    change_type: str = Field(
        ...,
        description="Categorization: compatible, requires_funding, alternative_recommendation, location_mismatch, or path_mismatch",
    )
    reason: str = Field(
        ...,
        description="Clear, deterministic explanation for why the pathway falls into this category",
    )
    funding_gap: Optional[float] = Field(
        None,
        description="Annual deficit amount if requires_funding",
    )
    suggested_actions: List[str] = Field(
        default_factory=list,
        description="Constructive guidance (e.g. scholarship application, loan, hybrid path)",
    )


class WhatIfResultGroupSchema(BaseModel):
    available: List[PathwayOptionSchema] = Field(
        default_factory=list,
        description="Pathways fully compatible with current budget, location, and track",
    )
    requires_funding: List[PathwayOptionSchema] = Field(
        default_factory=list,
        description="Pathways matching academic interest but exceeding current annual budget",
    )
    affected: List[PathwayOptionSchema] = Field(
        default_factory=list,
        description="Alternative pathways offered as realistic substitutes given constraints",
    )
    excluded: List[PathwayOptionSchema] = Field(
        default_factory=list,
        description="Pathways filtered out by conflicting location or non-selected models",
    )


class SimpleCareerHeaderSchema(BaseModel):
    id: str
    title: str


class WhatIfResponse(BaseModel):
    career: SimpleCareerHeaderSchema
    inputs: WhatIfRequest
    base_pathway: CareerPathwayResponse
    result: WhatIfResultGroupSchema
    changes: List[PathwayChangeExplanationSchema]
    summary: str = Field(
        ...,
        description="Objective summary of pathway accessibility and financial trade-offs (no career suitability judgments)",
    )
