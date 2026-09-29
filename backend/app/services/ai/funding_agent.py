import json
import logging
import re
from typing import List, Dict, Any
from app.services.ai.base import LLMProvider, CareerAgentContext, FundingAgentOutput, FundingCandidateClaim

logger = logging.getLogger(__name__)


class FundingAgent:
    """
    Funding Agent specialist:
    Responsible for identifying relevant funding mechanisms (scholarships,
    education loans, institutional aid) strictly from supplied funding records.
    """

    def __init__(self, provider: LLMProvider):
        self.provider = provider

    async def analyze(
        self,
        career_context: CareerAgentContext,
        funding_records: List[Dict[str, Any]],
        query: str,
    ) -> FundingAgentOutput:
        if not funding_records:
            return FundingAgentOutput(
                candidates=[],
                unmet_needs=["No matching funding options found in database."],
                notes=["Consider institutional scholarships or self-funding alternatives."]
            )

        # Prepare formatted catalog for LLM prompt
        catalog_summary = []
        for rec in funding_records:
            catalog_summary.append({
                "funding_id": rec["id"],
                "name": rec["name"],
                "type": rec["type"],
                "provider": rec["provider"],
                "amount_description": rec["amount_description"],
                "eligibility_summary": rec["eligibility_summary"],
                "target_education_level": rec["target_education_level"],
                "location": rec["location"],
            })

        system_prompt = (
            "You are the Funding Agent for CareerQuest. Your responsibility is to analyze available funding programs "
            "and match them to the student's career pathway and budget.\n"
            "CRITICAL CONSTRAINTS:\n"
            "1. You are NOT allowed to invent funding programs, names, or amounts.\n"
            "2. You can ONLY select from the provided funding records catalog.\n"
            "3. Use the exact 'funding_id' and 'name' from the catalog.\n"
            "4. Return valid JSON only with structure:\n"
            '   {"candidates": [{"funding_id": str, "name": str, "type": str, "why_relevant": str, "eligibility_claim": str, "amount_claim": str}], "unmet_needs": list[str], "notes": list[str]}'
        )

        user_prompt = (
            f"FUNDING AGENT ANALYSIS\n"
            f"Career: {career_context.career_title}\n"
            f"Education Path: {career_context.education_path}\n"
            f"Budget: {career_context.annual_budget} {career_context.currency}\n"
            f"Deficit Gap: {career_context.annual_deficit} {career_context.currency}\n"
            f"Location: {career_context.location}\n"
            f"User Query: {query}\n\n"
            f"AVAILABLE FUNDING CATALOG:\n{json.dumps(catalog_summary, indent=2)}\n\n"
            f"Match the most suitable funding options from the catalog above."
        )

        try:
            raw_response = await self.provider.generate(prompt=user_prompt, system_prompt=system_prompt)
            clean_json = raw_response.strip()
            if clean_json.startswith("```"):
                clean_json = re.sub(r"^```(?:json)?\n?", "", clean_json)
                clean_json = re.sub(r"\n?```$", "", clean_json)
            parsed = json.loads(clean_json)

            candidates = []
            for item in parsed.get("candidates", []):
                candidates.append(
                    FundingCandidateClaim(
                        funding_id=item.get("funding_id", ""),
                        name=item.get("name", ""),
                        type=item.get("type", "scholarship"),
                        provider=item.get("provider"),
                        why_relevant=item.get("why_relevant", "Relevant to education and career pathway."),
                        eligibility_claim=item.get("eligibility_claim", ""),
                        amount_claim=item.get("amount_claim", ""),
                    )
                )

            return FundingAgentOutput(
                candidates=candidates,
                unmet_needs=parsed.get("unmet_needs", []),
                notes=parsed.get("notes", []),
            )
        except Exception as e:
            logger.warning(f"FundingAgent LLM parsing failed: {e}. Using deterministic selection.")
            # Fallback deterministic selection from records
            candidates = []
            for rec in funding_records[:3]:  # Top 3 matching
                candidates.append(
                    FundingCandidateClaim(
                        funding_id=rec["id"],
                        name=rec["name"],
                        type=rec["type"],
                        provider=rec["provider"],
                        why_relevant=f"Provides financial support structured for {career_context.career_title} students.",
                        eligibility_claim=rec["eligibility_summary"],
                        amount_claim=rec["amount_description"],
                    )
                )
            return FundingAgentOutput(
                candidates=candidates,
                unmet_needs=["Remaining balance beyond aid amounts"],
                notes=["Verify specific deadlines with providers directly."],
            )
