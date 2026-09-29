import pytest
from fastapi.testclient import TestClient
from app.models.career import Career
from app.services.comparison_service import ComparisonService


def test_compare_software_engineer_vs_lawyer(client: TestClient):
    """1. Test comparing Software Engineer vs Lawyer."""
    response = client.get("/api/v1/careers/compare?career_a=software-engineer&career_b=lawyer")
    assert response.status_code == 200
    data = response.json()

    # Check header
    assert data["career_a"]["slug"] == "software-engineer"
    assert data["career_a"]["title"] == "Software Engineer"
    assert data["career_b"]["slug"] == "lawyer"
    assert data["career_b"]["title"] == "Lawyer"

    # Check 12 standard dimensions
    dim_keys = [d["key"] for d in data["dimensions"]]
    expected_dimensions = [
        "overview",
        "education",
        "education_duration",
        "education_cost",
        "skills",
        "work_environment",
        "career_progression",
        "specializations",
        "work_models",
        "geographic_opportunities",
        "practical_considerations",
        "funding_considerations",
    ]
    for expected in expected_dimensions:
        assert expected in dim_keys, f"Missing dimension: {expected}"

    # Check data availability and content for both careers
    for dim in data["dimensions"]:
        assert dim["career_a"]["data_available"] is True
        assert len(dim["career_a"]["details"]) > 0
        assert dim["career_b"]["data_available"] is True
        assert len(dim["career_b"]["details"]) > 0

    # Check trade-offs
    assert len(data["trade_offs"]) >= 4
    trade_off_dims = [t["dimension"] for t in data["trade_offs"]]
    assert "education" in trade_off_dims
    assert "work_environment" in trade_off_dims

    # Check source and disclaimer
    assert data["source"]["is_mock"] is True
    assert "CareerQuest does not declare winners" in data["disclaimer"]


def test_compare_reverse_lawyer_vs_software_engineer(client: TestClient):
    """2. Test reverse comparison: Lawyer vs Software Engineer."""
    response = client.get("/api/v1/careers/compare?career_a=lawyer&career_b=software-engineer")
    assert response.status_code == 200
    data = response.json()

    assert data["career_a"]["slug"] == "lawyer"
    assert data["career_b"]["slug"] == "software-engineer"
    assert len(data["dimensions"]) == 12


def test_compare_same_career_error(client: TestClient):
    """3. Test comparing same career (Software Engineer vs Software Engineer) returns 400."""
    response = client.get("/api/v1/careers/compare?career_a=software-engineer&career_b=software-engineer")
    assert response.status_code == 400
    assert "Cannot compare a career with itself" in response.json()["detail"]


def test_compare_unknown_career(client: TestClient):
    """4. Test unknown career returns 404."""
    response = client.get("/api/v1/careers/compare?career_a=software-engineer&career_b=quantum-wizard")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"]


def test_compare_missing_parameter(client: TestClient):
    """5. Test missing query parameter returns 422 validation error."""
    response = client.get("/api/v1/careers/compare?career_a=software-engineer")
    assert response.status_code == 422


def test_missing_dimension_data_handling():
    """6. Test that sparse career data returns data_available=False and null value without crashing."""
    service = ComparisonService()
    sparse_career = Career(
        id="sparse-career",
        slug="sparse-career",
        title="Sparse Career",
        category="General",
        tagline="A career with minimal data",
        overview="",
        median_pay="N/A",
        projected_growth="N/A",
        work_life_context="",
        stress_context="",
    )

    val = service._extract_dimension_value(sparse_career, "specializations")
    assert val.data_available is False
    assert val.value is None
    assert val.details == []


def test_no_ranking_winner_or_suitability_score_in_response(client: TestClient):
    """7, 8, 9. Critical Product Rules: Verify response has no ranking, score, or winner fields."""
    response = client.get("/api/v1/careers/compare?career_a=software-engineer&career_b=lawyer")
    assert response.status_code == 200
    data = response.json()

    # Verify no winner / score / rank fields at root or dimension levels
    forbidden_keys = [
        "winner",
        "rank",
        "ranking",
        "score",
        "suitability_score",
        "best_career",
        "overall_winner",
        "career_a_score",
        "career_b_score",
    ]
    for key in forbidden_keys:
        assert key not in data, f"Forbidden key '{key}' found in response root."
        for dim in data["dimensions"]:
            assert key not in dim, f"Forbidden key '{key}' found in dimension."


def test_source_and_mock_metadata_preserved(client: TestClient):
    """10. Verify source and prototype mock metadata is explicitly preserved."""
    response = client.get("/api/v1/careers/compare?career_a=software-engineer&career_b=lawyer")
    assert response.status_code == 200
    data = response.json()

    assert "source" in data
    assert data["source"]["is_mock"] is True
    assert "name" in data["source"]
    assert "url" in data["source"]


def test_dimension_filter_optional_parameter(client: TestClient):
    """Test optional dimensions filtering parameter."""
    response = client.get(
        "/api/v1/careers/compare?career_a=software-engineer&career_b=lawyer&dimensions=education,skills,education_cost"
    )
    assert response.status_code == 200
    data = response.json()

    dim_keys = [d["key"] for d in data["dimensions"]]
    assert len(dim_keys) == 3
    assert set(dim_keys) == {"education", "skills", "education_cost"}
