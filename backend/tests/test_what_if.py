def test_what_if_btech_budget_available(client):
    """
    When annual budget (₹5,00,000) exceeds B.Tech prototype estimate (₹3,50,000),
    B.Tech should be in 'available' with 0 funding gap.
    """
    payload = {
        "education_budget": 500000,
        "currency": "INR",
        "preferred_location": "India",
        "education_path": "btech",
        "study_abroad": False,
    }
    response = client.post("/api/v1/careers/software-engineer/what-if", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["career"]["id"] == "software-engineer"
    assert data["inputs"]["education_budget"] == 500000

    # B.Tech should be available
    available_ids = [p["id"] for p in data["result"]["available"]]
    assert "path-swe-btech" in available_ids

    # Verify explanation
    btech_change = next(c for c in data["changes"] if c["pathway_id"] == "path-swe-btech")
    assert btech_change["change_type"] == "compatible"
    assert btech_change["funding_gap"] == 0.0


def test_what_if_btech_budget_requires_funding(client):
    """
    When annual budget (₹2,00,000) is below B.Tech prototype estimate (₹3,50,000),
    B.Tech should be in 'requires_funding' with funding gap ₹1,50,000,
    and B.Sc & Alternative should appear in 'affected' as accessible alternatives.
    """
    payload = {
        "education_budget": 200000,
        "currency": "INR",
        "preferred_location": "India",
        "education_path": "btech",
        "study_abroad": False,
    }
    response = client.post("/api/v1/careers/software-engineer/what-if", json=payload)
    assert response.status_code == 200
    data = response.json()

    funding_ids = [p["id"] for p in data["result"]["requires_funding"]]
    assert "path-swe-btech" in funding_ids

    # Check deficit amount
    btech_change = next(c for c in data["changes"] if c["pathway_id"] == "path-swe-btech")
    assert btech_change["change_type"] == "requires_funding"
    assert btech_change["funding_gap"] == 150000.0
    assert len(btech_change["suggested_actions"]) >= 2

    # Alternatives (B.Sc and Bootcamp) should be under affected
    affected_ids = [p["id"] for p in data["result"]["affected"]]
    assert "path-swe-bsc" in affected_ids
    assert "path-swe-alt" in affected_ids


def test_what_if_select_bsc(client):
    """
    When B.Sc is chosen with ₹2,00,000 budget (cost ₹1,20,000),
    B.Sc should be in 'available'.
    """
    payload = {
        "education_budget": 200000,
        "currency": "INR",
        "preferred_location": "India",
        "education_path": "bsc",
        "study_abroad": False,
    }
    response = client.post("/api/v1/careers/software-engineer/what-if", json=payload)
    assert response.status_code == 200
    data = response.json()

    available_ids = [p["id"] for p in data["result"]["available"]]
    assert "path-swe-bsc" in available_ids


def test_what_if_select_alternative(client):
    """
    When Alternative bootcamp is chosen with ₹50,000 budget (cost ₹45,000),
    Alternative pathway should be in 'available'.
    """
    payload = {
        "education_budget": 50000,
        "currency": "INR",
        "preferred_location": "India",
        "education_path": "alternative",
        "study_abroad": False,
    }
    response = client.post("/api/v1/careers/software-engineer/what-if", json=payload)
    assert response.status_code == 200
    data = response.json()

    available_ids = [p["id"] for p in data["result"]["available"]]
    assert "path-swe-alt" in available_ids


def test_what_if_study_abroad_true(client):
    """
    When study_abroad = True with budget = ₹30,00,000 (cost ₹24,00,000),
    International B.S. should be in 'available'.
    """
    payload = {
        "education_budget": 3000000,
        "currency": "INR",
        "preferred_location": "Abroad",
        "education_path": "btech",
        "study_abroad": True,
    }
    response = client.post("/api/v1/careers/software-engineer/what-if", json=payload)
    assert response.status_code == 200
    data = response.json()

    available_ids = [p["id"] for p in data["result"]["available"]]
    assert "path-swe-abroad" in available_ids


def test_what_if_study_abroad_false_excludes_abroad(client):
    """
    When study_abroad = False and preferred_location = India,
    International B.S. should be in 'excluded'.
    """
    payload = {
        "education_budget": 3000000,
        "currency": "INR",
        "preferred_location": "India",
        "education_path": "btech",
        "study_abroad": False,
    }
    response = client.post("/api/v1/careers/software-engineer/what-if", json=payload)
    assert response.status_code == 200
    data = response.json()

    excluded_ids = [p["id"] for p in data["result"]["excluded"]]
    assert "path-swe-abroad" in excluded_ids


def test_what_if_invalid_education_path(client):
    """Validation test: Invalid education path returns 422."""
    payload = {
        "education_budget": 200000,
        "currency": "INR",
        "preferred_location": "India",
        "education_path": "invalid_doctorate_degree",
        "study_abroad": False,
    }
    response = client.post("/api/v1/careers/software-engineer/what-if", json=payload)
    assert response.status_code == 422


def test_what_if_negative_budget(client):
    """Validation test: Negative budget returns 422."""
    payload = {
        "education_budget": -25000,
        "currency": "INR",
        "preferred_location": "India",
        "education_path": "btech",
        "study_abroad": False,
    }
    response = client.post("/api/v1/careers/software-engineer/what-if", json=payload)
    assert response.status_code == 422


def test_what_if_unknown_career(client):
    """404 test: Unknown career slug returns 404."""
    payload = {
        "education_budget": 200000,
        "currency": "INR",
        "preferred_location": "India",
        "education_path": "btech",
        "study_abroad": False,
    }
    response = client.post("/api/v1/careers/nonexistent-astronaut-pilot/what-if", json=payload)
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_base_pathway_immutability(client):
    """
    CRITICAL ARCHITECTURAL CHECK:
    Running What-If calculations must NEVER mutate the base default pathway in the database.
    """
    # 1. Fetch base pathway before What-If
    before_res = client.get("/api/v1/careers/software-engineer/pathway")
    assert before_res.status_code == 200
    before_data = before_res.json()

    # 2. Run multiple contrasting What-If simulations
    client.post(
        "/api/v1/careers/software-engineer/what-if",
        json={"education_budget": 50000, "currency": "INR", "preferred_location": "India", "education_path": "alternative", "study_abroad": False},
    )
    client.post(
        "/api/v1/careers/software-engineer/what-if",
        json={"education_budget": 5000000, "currency": "INR", "preferred_location": "Abroad", "education_path": "btech", "study_abroad": True},
    )

    # 3. Fetch base pathway after What-If
    after_res = client.get("/api/v1/careers/software-engineer/pathway")
    assert after_res.status_code == 200
    after_data = after_res.json()

    # 4. Verify base pathway is 100% identical
    assert before_data["title"] == after_data["title"]
    assert before_data["total_duration_years"] == after_data["total_duration_years"]
    assert before_data["total_estimated_cost"] == after_data["total_estimated_cost"]
    assert len(before_data["nodes"]) == len(after_data["nodes"])
    assert len(before_data["edges"]) == len(after_data["edges"])


def test_zero_budget_edge_case(client):
    """
    Edge case: Budget = 0.
    Should return pathways under 'requires_funding' or 'excluded' with constructive financial aid guidance.
    """
    payload = {
        "education_budget": 0,
        "currency": "INR",
        "preferred_location": "India",
        "education_path": "btech",
        "study_abroad": False,
    }
    response = client.post("/api/v1/careers/software-engineer/what-if", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert len(data["result"]["requires_funding"]) >= 1
    btech_funding = next(p for p in data["result"]["requires_funding"] if p["id"] == "path-swe-btech")
    assert btech_funding["annual_estimated_cost"] > 0
