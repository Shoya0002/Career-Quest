def test_root_and_health(client):
    """Verify service root and health check endpoints."""
    res_root = client.get("/")
    assert res_root.status_code == 200
    assert res_root.json()["status"] == "online"

    res_health = client.get("/health")
    assert res_health.status_code == 200
    assert res_health.json()["status"] == "healthy"


def test_get_careers_list(client):
    """Verify standard career listing endpoint."""
    response = client.get("/api/v1/careers")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert data["total"] == 8
    assert len(data["items"]) == 8
    assert data["page"] == 1
    assert data["limit"] == 10

    # Verify explorer card format
    first_item = data["items"][0]
    assert "id" in first_item
    assert "slug" in first_item
    assert "title" in first_item
    assert "category" in first_item
    assert "tagline" in first_item
    assert "at_a_glance" in first_item
    assert "key_skills" in first_item


def test_search_careers(client):
    """Verify search filter across title, category, and skills."""
    # Search title
    res_swe = client.get("/api/v1/careers?search=software")
    assert res_swe.status_code == 200
    swe_items = res_swe.json()["items"]
    assert any(c["slug"] == "software-engineer" for c in swe_items)

    # Search skill keyword (e.g. Figma -> UX Designer)
    res_ux = client.get("/api/v1/careers?search=Figma")
    assert res_ux.status_code == 200
    ux_items = res_ux.json()["items"]
    assert any(c["slug"] == "ux-designer" for c in ux_items)


def test_filter_by_category(client):
    """Verify filtering by industry vertical category."""
    response = client.get("/api/v1/careers?category=Technology")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 2
    for item in data["items"]:
        assert item["category"].lower() == "technology"


def test_pagination(client):
    """Verify pagination mechanics."""
    response = client.get("/api/v1/careers?page=1&limit=3")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 3
    assert data["page"] == 1
    assert data["limit"] == 3
    assert data["total"] == 8
    assert data["total_pages"] == 3

    # Page 2
    response_p2 = client.get("/api/v1/careers?page=2&limit=3")
    assert response_p2.status_code == 200
    data_p2 = response_p2.json()
    assert len(data_p2["items"]) == 3
    assert data_p2["page"] == 2


def test_get_software_engineer_details(client):
    """Verify complete golden career profile."""
    response = client.get("/api/v1/careers/software-engineer")
    assert response.status_code == 200
    data = response.json()

    assert data["id"] == "software-engineer"
    assert data["slug"] == "software-engineer"
    assert data["title"] == "Software Engineer"
    assert data["category"] == "Technology"
    assert len(data["overview"]) > 50

    # At a glance
    assert "median_pay" in data["at_a_glance"]
    assert "projected_growth" in data["at_a_glance"]
    assert "work_life_context" in data["at_a_glance"]
    assert "stress_context" in data["at_a_glance"]

    # Responsibilities
    assert len(data["responsibilities"]) >= 4

    # Skills
    assert len(data["skills"]["technical"]) >= 4
    assert len(data["skills"]["professional"]) >= 3

    # Education
    assert len(data["education"]["after_class_10"]) >= 1
    assert len(data["education"]["after_class_12"]) >= 1
    assert len(data["education"]["entrance_requirements"]) >= 1
    assert len(data["education"]["certifications"]) >= 1

    # Progression
    assert len(data["progression"]) >= 4

    # Specializations
    assert len(data["specializations"]) >= 3

    # Financials
    assert len(data["financial"]["education_cost"]) >= 1
    assert len(data["financial"]["funding_options"]) >= 1

    # Practical considerations
    assert len(data["practical_considerations"]["positives"]) >= 2
    assert len(data["practical_considerations"]["challenges"]) >= 2

    # Opportunities
    assert len(data["opportunities"]["industries"]) >= 2
    assert len(data["opportunities"]["work_models"]) >= 1


def test_get_nonexistent_career(client):
    """Verify 404 handling for nonexistent career slugs."""
    response = client.get("/api/v1/careers/nonexistent-astronaut-surgeon")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_get_software_engineer_pathway(client):
    """Verify structured pathway endpoint for React Flow visual graph."""
    response = client.get("/api/v1/careers/software-engineer/pathway")
    assert response.status_code == 200
    data = response.json()

    assert data["career_id"] == "software-engineer"
    assert data["career_slug"] == "software-engineer"
    assert "title" in data
    assert "total_duration_years" in data
    assert data["total_duration_years"] > 0
    assert "expected_breakeven_years" in data
    assert len(data["nodes"]) >= 4
    assert len(data["edges"]) >= 3
    assert data["difficulty_score"] >= 1


def test_get_nonexistent_career_pathway(client):
    """Verify 404 handling for nonexistent pathway."""
    response = client.get("/api/v1/careers/nonexistent-slug/pathway")
    assert response.status_code == 404
