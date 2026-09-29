import logging
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.career import Career
from app.models.funding import FundingOption
from app.schemas.funding import (
    FundingAnalyzeRequest,
    FundingAnalysisResponse,
    FundingOptionPublicSchema,
    FundingSourceSchema,
)
from app.services.ai.provider import get_llm_provider
from app.services.ai.career_agent import CareerAgent
from app.services.ai.funding_agent import FundingAgent
from app.services.ai.validator import FundingValidator
from app.services.ai.synthesizer import ResponseSynthesizer
from app.services.ai.base import (
    CareerAgentContext,
    FundingAgentOutput,
    FundingCandidateClaim,
    ValidationReport,
)

logger = logging.getLogger(__name__)


class FundingService:
    def __init__(self):
        self.provider = get_llm_provider()
        self.career_agent = CareerAgent(self.provider)
        self.funding_agent = FundingAgent(self.provider)
        self.validator = FundingValidator()
        self.synthesizer = ResponseSynthesizer()

    def get_funding_options(
        self,
        db: Session,
        career_category: Optional[str] = None,
        education_level: Optional[str] = None,
        location: Optional[str] = None,
        type: Optional[str] = None,
    ) -> List[FundingOption]:
        query = db.query(FundingOption)

        if type:
            query = query.filter(FundingOption.type == type.lower())

        if location:
            query = query.filter(
                or_(
                    FundingOption.location.ilike(f"%{location}%"),
                    FundingOption.location.ilike("%Global%"),
                )
            )

        if education_level:
            query = query.filter(
                or_(
                    FundingOption.target_education_level == education_level.lower(),
                    FundingOption.target_education_level == "all",
                )
            )

        results = query.all()

        # In-memory filter for JSON target_career_categories if specified
        if career_category:
            filtered = []
            cat_lower = career_category.lower()
            for item in results:
                cats = [c.lower() for c in (item.target_career_categories or [])]
                if "all" in cats or any(cat_lower in c for c in cats):
                    filtered.append(item)
            return filtered

        return results

    def get_funding_option_by_id(self, db: Session, option_id: str) -> Optional[FundingOption]:
        return db.query(FundingOption).filter(FundingOption.id == option_id).first()

    async def analyze_funding(
        self, db: Session, request: FundingAnalyzeRequest
    ) -> Optional[FundingAnalysisResponse]:
        # 1. Fetch career from database
        career = db.query(Career).filter(Career.slug == request.career_slug).first()
        if not career:
            return None

        # 2. Retrieve relevant funding records from database
        ed_path = request.education_path or "btech"
        ed_level = "bootcamp" if "bootcamp" in ed_path.lower() else "bachelor"
        db_records = self.get_funding_options(
            db=db,
            career_category=career.category,
            education_level=ed_level,
            location=request.location,
        )

        # If no specific matches, fetch all available records as fallback pool
        if not db_records:
            db_records = db.query(FundingOption).all()

        records_data = [rec.to_dict() for rec in db_records]

        trace_info = {
            "career_agent": "pending",
            "funding_agent": "pending",
            "validator": "pending",
        }

        try:
            # 3. Career Agent Execution
            career_context = await self.career_agent.analyze(
                career_title=career.title,
                education_path=ed_path,
                annual_budget=request.annual_budget,
                currency=request.currency,
                location=request.location,
                query=request.query or "Funding options for career pathway",
            )
            trace_info["career_agent"] = "completed"

            # 4. Funding Agent Execution
            funding_output = await self.funding_agent.analyze(
                career_context=career_context,
                funding_records=records_data,
                query=request.query or "",
            )
            trace_info["funding_agent"] = "completed"

            # 5. Validation Layer Execution
            validation_report = self.validator.validate(
                career_context=career_context,
                funding_agent_output=funding_output,
                original_records=records_data,
            )
            trace_info["validator"] = "completed"

            # Fallback if no candidate passed validation
            if not validation_report.validated_options and records_data:
                logger.info("Engaging deterministic fallback after empty validation output.")
                fallback_output = self._deterministic_fallback_funding(career_context, records_data)
                validation_report = self.validator.validate(
                    career_context=career_context,
                    funding_agent_output=fallback_output,
                    original_records=records_data,
                )

        except Exception as e:
            logger.error(f"Error during AI pipeline execution: {e}. Executing deterministic fallback.")
            trace_info["career_agent"] = "fallback"
            trace_info["funding_agent"] = "fallback"
            trace_info["validator"] = "completed"

            # Deterministic pipeline fallback
            career_context = CareerAgentContext(
                career_title=career.title,
                education_path=ed_path,
                annual_budget=request.annual_budget,
                currency=request.currency,
                location=request.location,
                career_context=f"Structured {career.title} pathway requiring technical foundation in {ed_path}.",
                education_context=f"Education in {ed_path} in {request.location}.",
                funding_need_summary=f"Annual budget: {request.annual_budget} {request.currency}.",
                estimated_annual_cost=350000.0,
                annual_deficit=max(0.0, 350000.0 - request.annual_budget),
                constraints=[f"Budget: {request.annual_budget} {request.currency}", f"Location: {request.location}"],
            )
            fallback_output = self._deterministic_fallback_funding(career_context, records_data)
            validation_report = self.validator.validate(
                career_context=career_context,
                funding_agent_output=fallback_output,
                original_records=records_data,
            )

        # 6. Response Synthesis
        return self.synthesizer.synthesize(
            query=request.query or f"Funding analysis for {career.title}",
            career_id=str(career.id),
            career_slug=career.slug,
            career_title=career.title,
            career_context=career_context,
            validation_report=validation_report,
            debug=request.debug,
            trace_info=trace_info,
        )

    def _deterministic_fallback_funding(
        self, career_context: CareerAgentContext, records_data: List[Dict[str, Any]]
    ) -> FundingAgentOutput:
        candidates = []
        for rec in records_data:
            candidates.append(
                FundingCandidateClaim(
                    funding_id=rec["id"],
                    name=rec["name"],
                    type=rec["type"],
                    provider=rec["provider"],
                    why_relevant=f"Structured financial mechanism supporting {career_context.career_title} students.",
                    eligibility_claim=rec["eligibility_summary"],
                    amount_claim=rec["amount_description"],
                )
            )
        return FundingAgentOutput(
            candidates=candidates,
            unmet_needs=["Remaining balance beyond available financial aid"],
            notes=["Always cross-check eligibility requirements directly with the granting organization."],
        )
