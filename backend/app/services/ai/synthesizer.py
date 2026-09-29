from typing import Optional, Dict, Any
from app.schemas.funding import (
    FundingAnalysisResponse,
    ValidatedFundingOptionSchema,
    FundingSourceSchema,
    CareerReferenceSchema,
    FundingNeedSchema,
    AgentTraceSchema,
)
from app.services.ai.base import CareerAgentContext, ValidationReport


class ResponseSynthesizer:
    """
    Synthesizer Layer:
    Assembles validated options, educational context, deficit calculations,
    and compliance disclaimers into the final structured response.
    """

    def synthesize(
        self,
        query: str,
        career_id: str,
        career_slug: str,
        career_title: str,
        career_context: CareerAgentContext,
        validation_report: ValidationReport,
        debug: bool = False,
        trace_info: Optional[Dict[str, str]] = None,
    ) -> FundingAnalysisResponse:
        options = []
        for opt in validation_report.validated_options:
            source_dict = opt.source if isinstance(opt.source, dict) else opt.source.__dict__
            options.append(
                ValidatedFundingOptionSchema(
                    id=opt.id,
                    name=opt.name,
                    type=opt.type,
                    provider=opt.provider,
                    why_relevant=opt.why_relevant,
                    eligibility=opt.eligibility,
                    amount=opt.amount,
                    confidence=opt.confidence,
                    source=FundingSourceSchema(
                        name=source_dict.get("name", "Authoritative Source"),
                        url=source_dict.get("url", ""),
                        verified=source_dict.get("verified", False),
                        last_verified_at=source_dict.get("last_verified_at", "2026-01-01"),
                        is_mock=source_dict.get("is_mock", True),
                    ),
                )
            )

        trace = None
        if debug:
            trace = AgentTraceSchema(
                career_agent=trace_info.get("career_agent", "completed") if trace_info else "completed",
                funding_agent=trace_info.get("funding_agent", "completed") if trace_info else "completed",
                validator=trace_info.get("validator", "completed") if trace_info else "completed",
                synthesizer="completed",
            )

        return FundingAnalysisResponse(
            query=query,
            career=CareerReferenceSchema(
                id=career_id,
                slug=career_slug,
                title=career_title,
            ),
            funding_need=FundingNeedSchema(
                annual_budget=career_context.annual_budget,
                currency=career_context.currency,
                estimated_annual_cost=career_context.estimated_annual_cost,
                annual_deficit=career_context.annual_deficit,
            ),
            options=options,
            removed_claims=validation_report.removed_claims,
            uncertainties=validation_report.uncertainties,
            limitations=validation_report.limitations,
            disclaimer=(
                "Funding information is strictly informational and should be directly verified "
                "with the granting institution or financial provider before applying. CareerQuest "
                "does not guarantee scholarship eligibility or loan approval."
            ),
            trace=trace,
        )
