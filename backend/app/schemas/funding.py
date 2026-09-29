from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class FundingSourceSchema(BaseModel):
    name: str
    url: str
    verified: bool = False
    last_verified_at: str
    is_mock: bool = True

    model_config = ConfigDict(from_attributes=True)


class FundingOptionPublicSchema(BaseModel):
    id: str
    name: str
    type: str
    description: str
    provider: str
    target_education_level: str
    target_career_categories: List[str]
    location: str
    amount_description: str
    eligibility_summary: str
    requirements: List[str] = []
    application_information: str
    source: FundingSourceSchema

    model_config = ConfigDict(from_attributes=True)


class FundingListResponse(BaseModel):
    items: List[FundingOptionPublicSchema]
    total: int


class FundingAnalyzeRequest(BaseModel):
    career_slug: str = Field(..., description="Unique slug of the career (e.g. software-engineer)")
    education_path: Optional[str] = Field(None, description="Chosen education pathway (e.g. btech, bsc_cs, bootcamp)")
    annual_budget: float = Field(..., ge=0, description="Available annual budget in student currency")
    currency: str = Field("INR", description="Currency code (e.g. INR, USD)")
    location: str = Field("India", description="Geographic location of study")
    query: Optional[str] = Field("What funding options can help me pursue this career?", description="Student question or context")
    debug: bool = Field(False, description="Whether to include safe agent pipeline execution trace")


class ValidatedFundingOptionSchema(BaseModel):
    id: str
    name: str
    type: str
    provider: str
    why_relevant: str
    eligibility: str
    amount: str
    confidence: str = Field("supported", description="supported | partially_supported")
    source: FundingSourceSchema

    model_config = ConfigDict(from_attributes=True)


class AgentTraceSchema(BaseModel):
    career_agent: str
    funding_agent: str
    validator: str
    synthesizer: str


class FundingNeedSchema(BaseModel):
    annual_budget: float
    currency: str
    estimated_annual_cost: Optional[float] = None
    annual_deficit: Optional[float] = None


class CareerReferenceSchema(BaseModel):
    id: str
    slug: str
    title: str


class FundingAnalysisResponse(BaseModel):
    query: str
    career: CareerReferenceSchema
    funding_need: FundingNeedSchema
    options: List[ValidatedFundingOptionSchema]
    removed_claims: List[str] = []
    uncertainties: List[str] = []
    limitations: List[str] = []
    disclaimer: str = (
        "Funding information is strictly informational and should be directly verified "
        "with the granting institution or financial provider before applying. CareerQuest "
        "does not guarantee scholarship eligibility or loan approval."
    )
    trace: Optional[AgentTraceSchema] = None
