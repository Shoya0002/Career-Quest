from typing import List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict, Field


# --- Sub-schemas for nested structured career details ---

class AtAGlanceSchema(BaseModel):
    median_pay: str = Field(..., description="Estimated median compensation or range")
    projected_growth: str = Field(..., description="Projected industry job market growth rate")
    work_life_context: str = Field(..., description="Typical working environment, remote flexibility, and hours")
    stress_context: str = Field(..., description="Typical cognitive load and pressure points")

    model_config = ConfigDict(from_attributes=True)


class SkillItemSchema(BaseModel):
    id: Optional[int] = None
    name: str = Field(..., description="Skill name")
    importance_score: int = Field(..., ge=1, le=10, description="Importance score from 1 to 10")

    model_config = ConfigDict(from_attributes=True)


class SkillsGroupSchema(BaseModel):
    technical: List[SkillItemSchema] = Field(default_factory=list, description="Technical / Hard skills")
    professional: List[SkillItemSchema] = Field(default_factory=list, description="Professional / Soft skills")


class EducationPhaseItemSchema(BaseModel):
    id: Optional[int] = None
    title: str = Field(..., description="Phase credential or requirement title")
    description: str = Field(..., description="Detailed academic guidance or curriculum")
    duration: Optional[str] = Field(None, description="Typical duration e.g. 2 years / 4 years")
    estimated_cost: Optional[str] = Field(None, description="Estimated cost range or free")

    model_config = ConfigDict(from_attributes=True)


class EducationGroupSchema(BaseModel):
    after_class_10: List[EducationPhaseItemSchema] = Field(default_factory=list, description="Recommended stream and foundation")
    after_class_12: List[EducationPhaseItemSchema] = Field(default_factory=list, description="Undergraduate / Bachelor degrees")
    entrance_requirements: List[EducationPhaseItemSchema] = Field(default_factory=list, description="Standardized exams / entrance criteria")
    certifications: List[EducationPhaseItemSchema] = Field(default_factory=list, description="Industry recognized certifications")


class ProgressionStepSchema(BaseModel):
    id: Optional[int] = None
    level_title: str = Field(..., description="Career ladder level")
    experience_range: str = Field(..., description="Typical years of professional experience")
    typical_role: str = Field(..., description="Representative job title and scope")
    salary_range: str = Field(..., description="Illustrative compensation band")

    model_config = ConfigDict(from_attributes=True)


class SpecializationSchema(BaseModel):
    id: Optional[int] = None
    title: str = Field(..., description="Specialization domain or sub-field")
    description: str = Field(..., description="Scope and focus of specialization")
    market_demand: str = Field(..., description="Demand rating e.g. High / Very High / Emerging")

    model_config = ConfigDict(from_attributes=True)


class FinancialItemSchema(BaseModel):
    id: Optional[int] = None
    title: str = Field(..., description="Cost category or funding vehicle name")
    amount_or_range: str = Field(..., description="Estimated cost or award amount")
    notes: Optional[str] = Field(None, description="Eligibility or repayment context")

    model_config = ConfigDict(from_attributes=True)


class FinancialGroupSchema(BaseModel):
    education_cost: List[FinancialItemSchema] = Field(default_factory=list, description="Tuition and institutional fees")
    additional_costs: List[FinancialItemSchema] = Field(default_factory=list, description="Living, software, exam fees")
    funding_options: List[FinancialItemSchema] = Field(default_factory=list, description="Scholarships, loans, assistantships")


class PracticalConsiderationsSchema(BaseModel):
    positives: List[str] = Field(default_factory=list, description="Rewarding aspects and advantages")
    challenges: List[str] = Field(default_factory=list, description="Demanding realities and trade-offs")


class OpportunityItemSchema(BaseModel):
    id: Optional[int] = None
    name: str = Field(..., description="Industry, work model, or geographic hub name")
    description: Optional[str] = Field(None, description="Contextual market overview")

    model_config = ConfigDict(from_attributes=True)


class OpportunitiesGroupSchema(BaseModel):
    industries: List[OpportunityItemSchema] = Field(default_factory=list, description="Hiring industry sectors")
    work_models: List[OpportunityItemSchema] = Field(default_factory=list, description="Remote / Hybrid / On-site prevalence")
    geographic_options: List[OpportunityItemSchema] = Field(default_factory=list, description="Primary employment hubs")


# --- Main API Response Schemas ---

class CareerListItemResponse(BaseModel):
    id: str = Field(..., description="Unique career identifier")
    slug: str = Field(..., description="URL-friendly identifier")
    title: str = Field(..., description="Standard profession title")
    category: str = Field(..., description="Career category or industry vertical")
    tagline: str = Field(..., description="Short engaging subtitle")
    at_a_glance: AtAGlanceSchema = Field(..., description="Summary metrics for explorer card")
    key_skills: List[str] = Field(default_factory=list, description="Top key skills")

    model_config = ConfigDict(from_attributes=True)


class CareerListPaginationResponse(BaseModel):
    items: List[CareerListItemResponse] = Field(..., description="List of career cards for explorer")
    total: int = Field(..., description="Total count matching filter criteria")
    page: int = Field(..., ge=1, description="Current page number")
    limit: int = Field(..., ge=1, description="Items per page")
    total_pages: int = Field(..., ge=0, description="Total pages available")


class CareerDetailResponse(BaseModel):
    id: str = Field(..., description="Unique career identifier")
    slug: str = Field(..., description="URL-friendly identifier")
    title: str = Field(..., description="Standard profession title")
    category: str = Field(..., description="Career category / vertical")
    tagline: str = Field(..., description="Short engaging summary tagline")
    overview: str = Field(..., description="Comprehensive profession overview")

    at_a_glance: AtAGlanceSchema = Field(..., description="High-level salary, growth, and work conditions")
    responsibilities: List[str] = Field(default_factory=list, description="Daily professional responsibilities")
    skills: SkillsGroupSchema = Field(..., description="Technical and professional skill requirements")
    education: EducationGroupSchema = Field(..., description="Structured academic and certification pathways")
    progression: List[ProgressionStepSchema] = Field(default_factory=list, description="Career progression ladder")
    specializations: List[SpecializationSchema] = Field(default_factory=list, description="Sub-field specializations")
    financial: FinancialGroupSchema = Field(..., description="Education costs and funding breakdown")
    practical_considerations: PracticalConsiderationsSchema = Field(..., description="Real-world trade-offs")
    opportunities: OpportunitiesGroupSchema = Field(..., description="Industries, work models, and geography")

    model_config = ConfigDict(from_attributes=True)


# --- Pathway Schemas ---

class PathwayNodeSchema(BaseModel):
    id: str
    type: Optional[str] = "default"
    position: Dict[str, float]
    data: Dict[str, Any]


class PathwayEdgeSchema(BaseModel):
    id: str
    source: str
    target: str
    label: Optional[str] = None
    animated: Optional[bool] = False
    style: Optional[Dict[str, Any]] = None


class CareerPathwayResponse(BaseModel):
    career_id: str = Field(..., description="Associated career ID")
    career_slug: str = Field(..., description="Associated career slug")
    title: str = Field(..., description="Pathway title")
    description: str = Field(..., description="Pathway narrative overview")
    total_duration_years: float = Field(..., description="Estimated total academic duration in years")
    total_estimated_cost: str = Field(..., description="Total estimated education cost range")
    expected_breakeven_years: float = Field(..., description="Estimated years to recoup education investment")
    difficulty_score: int = Field(..., ge=1, le=10, description="Academic and training rigor score (1-10)")
    nodes: List[PathwayNodeSchema] = Field(default_factory=list, description="React Flow compatible graph nodes")
    edges: List[PathwayEdgeSchema] = Field(default_factory=list, description="React Flow compatible graph edges")

    model_config = ConfigDict(from_attributes=True)
