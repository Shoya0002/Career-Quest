import json
import logging
import re
from typing import Dict, Any, Optional
from app.services.ai.base import LLMProvider, CareerAgentContext

logger = logging.getLogger(__name__)


class CareerAgent:
    """
    Career Agent specialist:
    Responsible for understanding the selected career, education pathway,
    academic requirements, and financial deficit context.
    """

    def __init__(self, provider: LLMProvider):
        self.provider = provider

    async def analyze(
        self,
        career_title: str,
        education_path: str,
        annual_budget: float,
        currency: str,
        location: str,
        query: str,
        career_details: Optional[Dict[str, Any]] = None,
    ) -> CareerAgentContext:
        # Determine baseline education cost estimation
        estimated_annual_cost = 350000.0  # Default baseline for B.Tech in India
        if "bootcamp" in education_path.lower():
            estimated_annual_cost = 200000.0
        elif "bsc" in education_path.lower() or "bca" in education_path.lower():
            estimated_annual_cost = 150000.0
        elif "abroad" in location.lower() or "usa" in location.lower():
            estimated_annual_cost = 2500000.0

        annual_deficit = max(0.0, estimated_annual_cost - annual_budget)

        system_prompt = (
            "You are the Career Agent for CareerQuest. Your task is to analyze the student's chosen career, "
            "education pathway, and financial context.\n"
            "STRICT RULES:\n"
            "1. Only evaluate the career and educational context provided.\n"
            "2. Do NOT invent funding programs or specific loan names.\n"
            "3. Output MUST be valid JSON only with the following keys:\n"
            '   {"career_context": str, "education_context": str, "funding_need_summary": str, "constraints": list[str]}'
        )

        user_prompt = (
            f"CAREER AGENT ANALYSIS\n"
            f"Career: {career_title}\n"
            f"Education Path: {education_path}\n"
            f"Location: {location}\n"
            f"Student Annual Budget: {annual_budget} {currency}\n"
            f"Estimated Annual Cost: {estimated_annual_cost} {currency}\n"
            f"Estimated Deficit: {annual_deficit} {currency}\n"
            f"User Query: {query}\n"
            f"Produce structured context in JSON format."
        )

        try:
            raw_response = await self.provider.generate(prompt=user_prompt, system_prompt=system_prompt)
            # Clean JSON if wrapped in markdown code blocks
            clean_json = raw_response.strip()
            if clean_json.startswith("```"):
                clean_json = re.sub(r"^```(?:json)?\n?", "", clean_json)
                clean_json = re.sub(r"\n?```$", "", clean_json)
            parsed = json.loads(clean_json)

            return CareerAgentContext(
                career_title=career_title,
                education_path=education_path,
                annual_budget=annual_budget,
                currency=currency,
                location=location,
                career_context=parsed.get(
                    "career_context",
                    f"{career_title} pathway requiring foundational technical education in {education_path}."
                ),
                education_context=parsed.get(
                    "education_context",
                    f"Degree pathway in {education_path} typically takes 3-4 years in {location}."
                ),
                funding_need_summary=parsed.get(
                    "funding_need_summary",
                    f"Student has annual budget of {annual_budget} {currency} with an estimated gap of {annual_deficit} {currency}."
                ),
                estimated_annual_cost=estimated_annual_cost,
                annual_deficit=annual_deficit,
                constraints=parsed.get("constraints", [f"Budget: {annual_budget} {currency}", f"Location: {location}"]),
            )
        except Exception as e:
            logger.warning(f"CareerAgent LLM parsing failed: {e}. Using deterministic fallback.")
            return CareerAgentContext(
                career_title=career_title,
                education_path=education_path,
                annual_budget=annual_budget,
                currency=currency,
                location=location,
                career_context=f"{career_title} technical pathway requiring structured higher education.",
                education_context=f"The {education_path} track entails intensive coursework and practical lab requirements.",
                funding_need_summary=f"Annual budget of {annual_budget} {currency} leaves estimated deficit of {annual_deficit} {currency}.",
                estimated_annual_cost=estimated_annual_cost,
                annual_deficit=annual_deficit,
                constraints=[f"Annual budget: {annual_budget} {currency}", f"Study location: {location}"],
            )
