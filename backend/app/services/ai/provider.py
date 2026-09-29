import json
import logging
from typing import Optional, Dict, Any
import httpx
from app.core.config import settings
from app.services.ai.base import LLMProvider

logger = logging.getLogger(__name__)


class DefaultLLMProvider(LLMProvider):
    """
    Standard HTTP-based LLM Provider compatible with OpenAI/Gemini/Ollama endpoints.
    Uses configurable environment settings (LLM_API_KEY, LLM_MODEL, LLM_BASE_URL).
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        model: Optional[str] = None,
        base_url: Optional[str] = None,
    ):
        self.api_key = api_key or settings.LLM_API_KEY
        self.model = model or settings.LLM_MODEL
        self.base_url = (base_url or settings.LLM_BASE_URL).rstrip("/") if (base_url or settings.LLM_BASE_URL) else ""

    async def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        if not self.api_key:
            raise ValueError("LLM_API_KEY is not configured.")

        # Determine endpoint URL
        base = self.base_url or "https://api.openai.com/v1"
        url = f"{base}/chat/completions"

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": 0.1,  # Low temperature to minimize hallucination
        }

        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(url, headers=headers, json=payload)
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]


class FallbackLLMProvider(LLMProvider):
    """
    Deterministic LLM Provider used when external LLM APIs are not configured
    or during tests/offline demo runs.
    """

    async def generate(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        # Returns a deterministic structured response depending on agent context
        if "Career Agent" in (system_prompt or "") or "CAREER AGENT" in prompt:
            return json.dumps({
                "career_context": "Software Engineering pathways require structured foundation in computer science and programming fundamentals.",
                "education_context": "Undergraduate B.Tech degree typically spans 4 years with tuition and living expenses.",
                "funding_need_summary": "Financial deficit exists between annual tuition cost and available student budget.",
                "constraints": ["Budget constraint identified", "Location: India"]
            })
        elif "Funding Agent" in (system_prompt or "") or "FUNDING AGENT" in prompt:
            return json.dumps({
                "candidates": [
                    {
                        "funding_id": "fund-stem-merit-scholarship",
                        "name": "National STEM Excellence Scholarship",
                        "type": "scholarship",
                        "why_relevant": "Provides direct merit tuition relief for undergraduate B.Tech STEM degrees.",
                        "eligibility_claim": "Minimum 80% aggregate in 10+2 PCM with family income criteria.",
                        "amount_claim": "Up to ₹1,50,000 / year tuition fee waiver"
                    },
                    {
                        "funding_id": "fund-national-education-loan",
                        "name": "Priority Higher Education Loan Scheme",
                        "type": "education_loan",
                        "why_relevant": "Covers tuition and living expense deficit with student moratorium period.",
                        "eligibility_claim": "Secured admission in approved technical degree program.",
                        "amount_claim": "Up to ₹7,50,000 without collateral"
                    }
                ],
                "unmet_needs": ["Living expenses beyond tuition waiver"],
                "notes": ["Applicant should maintain required GPA throughout degree."]
            })
        return "{}"


def get_llm_provider() -> LLMProvider:
    """Factory method to get LLM provider based on environment configuration."""
    if settings.LLM_API_KEY:
        return DefaultLLMProvider()
    return FallbackLLMProvider()
