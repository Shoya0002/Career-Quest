import pytest
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient

from app.main import app
from app.models.funding import FundingOption
from app.schemas.funding import FundingAnalyzeRequest
from app.services.ai.base import (
    CareerAgentContext,
    FundingAgentOutput,
    FundingCandidateClaim,
)
from app.services.ai.validator import FundingValidator
from app.services.funding_service import FundingService


def test_get_funding_records(client: TestClient):
    """1. Test retrieving all funding records."""
    response = client.get("/api/v1/funding")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert data["total"] >= 5
    assert any(item["id"] == "fund-stem-merit-scholarship" for item in data["items"])


def test_funding_filtering(client: TestClient):
    """2. Test filtering funding options by type, location, and education level."""
    # Filter by type: scholarship
    res_type = client.get("/api/v1/funding?type=scholarship")
    assert res_type.status_code == 200
    items = res_type.json()["items"]
    assert all(item["type"] == "scholarship" for item in items)

    # Filter by education_level: bachelor
    res_level = client.get("/api/v1/funding?education_level=bachelor")
    assert res_level.status_code == 200
    items_level = res_level.json()["items"]
    assert len(items_level) > 0

    # Filter by location: India
    res_loc = client.get("/api/v1/funding?location=India")
    assert res_loc.status_code == 200
    assert len(res_loc.json()["items"]) > 0


def test_get_single_funding_option(client: TestClient):
    """Test retrieving a single funding option by ID."""
    response = client.get("/api/v1/funding/fund-stem-merit-scholarship")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "fund-stem-merit-scholarship"
    assert data["name"] == "National STEM Excellence Scholarship"
    assert "source" in data
    assert data["source"]["is_mock"] is True


def test_get_nonexistent_funding_option(client: TestClient):
    """Test 404 for non-existent funding ID."""
    response = client.get("/api/v1/funding/non-existent-fund-xyz")
    assert response.status_code == 404


def test_funding_analyze_software_engineer(client: TestClient):
    """3. Test funding analysis with valid career and budget query."""
    payload = {
        "career_slug": "software-engineer",
        "education_path": "btech",
        "annual_budget": 200000,
        "currency": "INR",
        "location": "India",
        "query": "What funding options can help me pursue software engineering in India with budget ₹2 lakh?",
        "debug": True,
    }
    response = client.post("/api/v1/funding/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["career"]["slug"] == "software-engineer"
    assert data["career"]["title"] == "Software Engineer"
    assert data["funding_need"]["annual_budget"] == 200000
    assert len(data["options"]) > 0

    # Verify source metadata exists on every option
    for option in data["options"]:
        assert "source" in option
        assert "name" in option["source"]
        assert "url" in option["source"]
        assert option["source"]["is_mock"] is True
        assert option["confidence"] in ["supported", "partially_supported"]

    # Verify standard disclaimer
    assert "strictly informational" in data["disclaimer"]
    # Verify debug trace
    assert data["trace"] is not None
    assert data["trace"]["career_agent"] in ["completed", "fallback"]
    assert data["trace"]["validator"] == "completed"


def test_funding_analyze_unknown_career(client: TestClient):
    """4. Test unknown career 404 handling."""
    payload = {
        "career_slug": "quantum-teleportation-wizard",
        "annual_budget": 100000,
    }
    response = client.post("/api/v1/funding/analyze", json=payload)
    assert response.status_code == 404
    assert "not found" in response.json()["detail"]


def test_funding_analyze_invalid_request(client: TestClient):
    """5. Test invalid request (e.g. negative budget)."""
    payload = {
        "career_slug": "software-engineer",
        "annual_budget": -50000,
    }
    response = client.post("/api/v1/funding/analyze", json=payload)
    assert response.status_code == 422


def test_validator_mandatory_hallucination_removal():
    """
    6 & 7 & MANDATORY HALLUCINATION TEST:
    Simulate Funding Agent returning a hallucinated scholarship ('Fake Scholarship', ₹5,00,000)
    that does NOT exist in the database.
    Validator MUST remove it and record it in removed_claims.
    """
    validator = FundingValidator()

    career_context = CareerAgentContext(
        career_title="Software Engineer",
        education_path="btech",
        annual_budget=200000.0,
        currency="INR",
        location="India",
        career_context="Software Engineer degree.",
        education_context="B.Tech 4 years.",
        funding_need_summary="Gap of ₹1,50,000.",
        estimated_annual_cost=350000.0,
        annual_deficit=150000.0,
    )

    # Agent output contains 1 real funding option and 1 hallucinated option
    agent_output = FundingAgentOutput(
        candidates=[
            FundingCandidateClaim(
                funding_id="fund-stem-merit-scholarship",
                name="National STEM Excellence Scholarship",
                type="scholarship",
                why_relevant="Valid merit scholarship.",
                eligibility_claim="80%+ in 10+2 PCM",
                amount_claim="Up to ₹1,50,000 / year tuition fee waiver",
            ),
            FundingCandidateClaim(
                funding_id="hallucinated-fund-999",
                name="Fake Scholarship",
                type="scholarship",
                why_relevant="Hallucinated free money program.",
                eligibility_claim="Anyone who wants it.",
                amount_claim="₹5,00,000",
            ),
        ]
    )

    # Authoritative DB records ONLY contain the real record
    db_records = [
        {
            "id": "fund-stem-merit-scholarship",
            "name": "National STEM Excellence Scholarship",
            "type": "scholarship",
            "provider": "National Science Foundation",
            "amount_description": "Up to ₹1,50,000 / year tuition fee waiver",
            "eligibility_summary": "Minimum 80% aggregate in 10+2 (PCM)",
            "source_name": "STEM Foundation Portal",
            "source_url": "https://demo.careerquest.org/sources/stem",
            "source_verified": False,
            "last_verified_at": "2026-03-01",
            "is_mock": True,
        }
    ]

    report = validator.validate(
        career_context=career_context,
        funding_agent_output=agent_output,
        original_records=db_records,
    )

    # Assertions
    # 1. Fake scholarship is NOT in validated_options
    validated_names = [opt.name for opt in report.validated_options]
    assert "Fake Scholarship" not in validated_names
    assert len(report.validated_options) == 1
    assert report.validated_options[0].name == "National STEM Excellence Scholarship"

    # 2. Fake scholarship is explicitly documented in removed_claims
    assert len(report.removed_claims) == 1
    assert "Fake Scholarship" in report.removed_claims[0]
    assert "not found in verified database catalog" in report.removed_claims[0]


def test_validator_amount_hallucination_correction():
    """
    Test that if an agent claims an exaggerated amount for a known scholarship,
    the validator corrects it to the authoritative database description.
    """
    validator = FundingValidator()

    career_context = CareerAgentContext(
        career_title="Software Engineer",
        education_path="btech",
        annual_budget=200000.0,
        currency="INR",
        location="India",
        career_context="CS track.",
        education_context="4-year B.Tech.",
        funding_need_summary="Budget gap.",
        estimated_annual_cost=350000.0,
        annual_deficit=150000.0,
    )

    # Agent claims ₹10,00,000 for a scholarship that only provides ₹1,50,000
    agent_output = FundingAgentOutput(
        candidates=[
            FundingCandidateClaim(
                funding_id="fund-stem-merit-scholarship",
                name="National STEM Excellence Scholarship",
                type="scholarship",
                why_relevant="Exaggerated claim test.",
                eligibility_claim="Eligibility text",
                amount_claim="₹10,00,000 full free ride",
            )
        ]
    )

    db_records = [
        {
            "id": "fund-stem-merit-scholarship",
            "name": "National STEM Excellence Scholarship",
            "type": "scholarship",
            "provider": "National Science Foundation",
            "amount_description": "Up to ₹1,50,000 / year tuition fee waiver",
            "eligibility_summary": "Minimum 80% aggregate in 10+2 (PCM)",
            "source_name": "STEM Foundation Portal",
            "source_url": "https://demo.careerquest.org/sources/stem",
            "source_verified": False,
            "last_verified_at": "2026-03-01",
            "is_mock": True,
        }
    ]

    report = validator.validate(
        career_context=career_context,
        funding_agent_output=agent_output,
        original_records=db_records,
    )

    # Validated option amount must match the authoritative DB record
    assert report.validated_options[0].amount == "Up to ₹1,50,000 / year tuition fee waiver"
    assert len(report.uncertainties) >= 1
    assert "was adjusted to grounded record description" in report.uncertainties[0]


@pytest.mark.asyncio
async def test_llm_provider_failure_triggers_fallback(client: TestClient):
    """9. Test that LLM failure gracefully triggers deterministic fallback without crashing."""
    with patch("app.services.ai.career_agent.CareerAgent.analyze", side_effect=RuntimeError("LLM API Timeout")):
        payload = {
            "career_slug": "software-engineer",
            "annual_budget": 200000,
            "currency": "INR",
            "location": "India",
            "debug": True,
        }
        response = client.post("/api/v1/funding/analyze", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert len(data["options"]) > 0
        assert data["trace"]["career_agent"] == "fallback"
        assert data["trace"]["validator"] == "completed"
