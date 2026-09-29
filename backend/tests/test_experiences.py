def test_get_experience_metadata(client):
    """Verify experience metadata, role context, learning objectives, and skills."""
    response = client.get("/api/v1/experiences/production-incident")
    assert response.status_code == 200
    data = response.json()
    assert data["slug"] == "production-incident"
    assert data["role"] == "Software Engineer"
    assert data["difficulty"] == "Intermediate"
    assert data["scenarios_count"] == 3
    assert len(data["skills"]) >= 4
    assert "Incident Response" in data["skills"]


def test_get_experience_not_found(client):
    """Verify 404 on nonexistent experience."""
    response = client.get("/api/v1/experiences/nonexistent-astronaut-mission")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_get_scenario_anti_cheating(client):
    """
    Verify public scenario retrieval and ensure hidden outcome data is NEVER exposed.
    """
    response = client.get("/api/v1/experiences/production-incident/scenarios/sc-swe-01")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "sc-swe-01"
    assert data["sequence"] == 1
    assert "The Production Alert" in data["title"]
    assert len(data["evidence"]) >= 4
    assert len(data["decisions"]) == 3

    # Anti-cheating verification: Ensure hidden outcomes/scores are NOT exposed
    for dec in data["decisions"]:
        assert "id" in dec
        assert "title" in dec
        assert "description" in dec
        assert "outcome" not in dec
        assert "score_delta" not in dec
        assert "next_scenario_id" not in dec
        assert "feedback" not in dec
        assert "consequence" not in dec


def test_create_session(client):
    """Verify session creation returns session token, experience details, and initial scenario."""
    response = client.post("/api/v1/experiences/production-incident/sessions")
    assert response.status_code == 201
    data = response.json()

    assert "session_id" in data
    assert data["session_id"].startswith("sess_")
    assert data["progress"]["current"] == 1
    assert data["progress"]["total"] == 3
    assert data["first_scenario"]["id"] == "sc-swe-01"
    assert len(data["first_scenario"]["decisions"]) == 3


def test_get_session_state(client):
    """Verify retrieving ongoing session state without leaking answers."""
    # Create session
    create_res = client.post("/api/v1/experiences/production-incident/sessions")
    session_id = create_res.json()["session_id"]

    # Get state
    response = client.get(f"/api/v1/experience-sessions/{session_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["session_id"] == session_id
    assert data["status"] == "in_progress"
    assert data["progress"]["current"] == 1
    assert data["total_score"] == 0
    assert data["decisions_made"] == 0
    assert data["current_scenario"]["id"] == "sc-swe-01"


def test_submit_invalid_decision_options(client):
    """Verify rejection of invalid decisions or wrong scenario decisions."""
    create_res = client.post("/api/v1/experiences/production-incident/sessions")
    session_id = create_res.json()["session_id"]

    # Decision from a future scenario (sc-swe-02) submitted to scenario 1
    bad_res_1 = client.post(
        f"/api/v1/experience-sessions/{session_id}/decisions",
        json={"scenario_id": "sc-swe-01", "decision_id": "dec-swe-2a"},
    )
    assert bad_res_1.status_code == 400
    assert "invalid" in bad_res_1.json()["detail"].lower()

    # Wrong scenario_id
    bad_res_2 = client.post(
        f"/api/v1/experience-sessions/{session_id}/decisions",
        json={"scenario_id": "sc-swe-02", "decision_id": "dec-swe-2a"},
    )
    assert bad_res_2.status_code == 400
    assert "does not match" in bad_res_2.json()["detail"].lower()

    # Nonexistent decision ID
    bad_res_3 = client.post(
        f"/api/v1/experience-sessions/{session_id}/decisions",
        json={"scenario_id": "sc-swe-01", "decision_id": "dec-fake-999"},
    )
    assert bad_res_3.status_code == 400


def test_complete_simulation_flow(client):
    """
    Test the COMPLETE multi-scenario simulation lifecycle:
    Session Start -> Scenario 1 Decision -> Scenario 2 Decision -> Scenario 3 Decision -> Completion -> Result & Reflections
    """
    # 1. Start Session
    create_res = client.post("/api/v1/experiences/production-incident/sessions")
    assert create_res.status_code == 201
    session_id = create_res.json()["session_id"]

    # 2. Scenario 1: Submit Decision 1A (Investigate v2.4.1 diff)
    d1_res = client.post(
        f"/api/v1/experience-sessions/{session_id}/decisions",
        json={"scenario_id": "sc-swe-01", "decision_id": "dec-swe-1a"},
    )
    assert d1_res.status_code == 200
    d1_data = d1_res.json()
    assert d1_data["is_completed"] is False
    assert d1_data["performance"]["score_delta"] == 25
    assert d1_data["next_scenario"]["id"] == "sc-swe-02"
    assert "telemetry pinpointed" in d1_data["outcome"]["title"].lower()

    # Check session state at Scenario 2
    state_s2 = client.get(f"/api/v1/experience-sessions/{session_id}").json()
    assert state_s2["status"] == "in_progress"
    assert state_s2["decisions_made"] == 1
    assert state_s2["total_score"] == 25
    assert state_s2["current_scenario"]["id"] == "sc-swe-02"

    # 3. Scenario 2: Submit Decision 2A (Rollback to v2.4.0)
    d2_res = client.post(
        f"/api/v1/experience-sessions/{session_id}/decisions",
        json={"scenario_id": "sc-swe-02", "decision_id": "dec-swe-2a"},
    )
    assert d2_res.status_code == 200
    d2_data = d2_res.json()
    assert d2_data["is_completed"] is False
    assert d2_data["performance"]["score_delta"] == 25
    assert d2_data["next_scenario"]["id"] == "sc-swe-03"
    assert "rollback completed" in d2_data["outcome"]["title"].lower()

    # 4. Scenario 3: Submit Decision 3A (Transparent communication & post-mortem)
    d3_res = client.post(
        f"/api/v1/experience-sessions/{session_id}/decisions",
        json={"scenario_id": "sc-swe-03", "decision_id": "dec-swe-3a"},
    )
    assert d3_res.status_code == 200
    d3_data = d3_res.json()
    assert d3_data["is_completed"] is True
    assert d3_data["next_scenario"] is None
    assert d3_data["performance"]["score_delta"] == 25

    # 5. Verify Session is now marked Completed
    state_completed = client.get(f"/api/v1/experience-sessions/{session_id}").json()
    assert state_completed["status"] == "completed"
    assert state_completed["decisions_made"] == 3
    assert state_completed["total_score"] == 75
    assert state_completed["current_scenario"] is None
    assert state_completed["completed_at"] is not None

    # 6. Verify Completed Session rejects further decision submissions (409 Conflict)
    conflict_res = client.post(
        f"/api/v1/experience-sessions/{session_id}/decisions",
        json={"scenario_id": "sc-swe-03", "decision_id": "dec-swe-3a"},
    )
    assert conflict_res.status_code == 409
    assert "already been completed" in conflict_res.json()["detail"].lower()

    # 7. Fetch Final Experience Result & Reflection Debrief
    result_res = client.get(f"/api/v1/experience-sessions/{session_id}/result")
    assert result_res.status_code == 200
    result_data = result_res.json()

    assert result_data["session_id"] == session_id
    assert result_data["status"] == "completed"
    assert result_data["total_score"] == 75
    assert result_data["scenarios_completed"] == 3
    assert len(result_data["skills_exercised"]) >= 4
    assert len(result_data["decisions_log"]) == 3
    assert len(result_data["strengths_demonstrated"]) >= 1
    assert len(result_data["areas_to_reflect_on"]) >= 2
    assert len(result_data["reflection_prompts"]) == 3

    # Verify log contents
    first_log = result_data["decisions_log"][0]
    assert first_log["scenario_title"] == "The Production Alert"
    assert "Investigate" in first_log["decision_title"]
    assert first_log["score_delta"] == 25


def test_invalid_session_not_found(client):
    """Verify 404 on nonexistent session ID."""
    res_state = client.get("/api/v1/experience-sessions/sess_nonexistent_xyz")
    assert res_state.status_code == 404

    res_result = client.get("/api/v1/experience-sessions/sess_nonexistent_xyz/result")
    assert res_result.status_code == 404


def test_software_engineer_alias(client):
    """Verify that the frontend alias slug 'software-engineer-incident' resolves cleanly."""
    res = client.get("/api/v1/experiences/software-engineer-incident")
    assert res.status_code == 200
    data = res.json()
    assert data["slug"] == "production-incident"
    assert data["first_scenario"] is not None
    assert data["first_scenario"]["id"] == "sc-swe-01"

    # Verify session creation with alias
    create_res = client.post("/api/v1/experiences/software-engineer-incident/sessions")
    assert create_res.status_code == 201
    assert create_res.json()["session_id"].startswith("sess_")
    assert create_res.json()["current_scenario"] is not None
