from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class LLMProvider(ABC):
    """Abstract interface for LLM providers."""

    @abstractmethod
    async def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        """Generate text completion from prompt."""
        pass


class CareerAgentContext(BaseModel):
    career_title: str
    education_path: str
    annual_budget: float
    currency: str
    location: str
    career_context: str
    education_context: str
    funding_need_summary: str
    estimated_annual_cost: Optional[float] = None
    annual_deficit: Optional[float] = None
    constraints: List[str] = []


class FundingCandidateClaim(BaseModel):
    funding_id: str
    name: str
    type: str
    provider: Optional[str] = None
    why_relevant: str
    eligibility_claim: str
    amount_claim: str


class FundingAgentOutput(BaseModel):
    candidates: List[FundingCandidateClaim] = []
    unmet_needs: List[str] = []
    notes: List[str] = []


class ValidatedCandidate(BaseModel):
    id: str
    name: str
    type: str
    provider: str
    why_relevant: str
    eligibility: str
    amount: str
    confidence: str  # "supported" | "partially_supported"
    source: Dict[str, Any]


class ValidationReport(BaseModel):
    validated_options: List[ValidatedCandidate] = []
    removed_claims: List[str] = []
    uncertainties: List[str] = []
    limitations: List[str] = []
