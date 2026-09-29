from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.experience_service import ExperienceService
from app.services.simulation_service import SimulationService
from app.schemas.experience import (
    ExperienceDetailResponse,
    ScenarioPublicResponse,
    ExperienceSessionCreateResponse,
    ExperienceSessionStateResponse,
    DecisionSubmitRequest,
    DecisionOutcomeResponse,
    ExperienceCompletionResultResponse,
)

router = APIRouter(tags=["Experience Lab"])


@router.get(
    "/experiences/{experience_slug}",
    response_model=ExperienceDetailResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Career Experience Metadata",
    description="Retrieve public details, role context, learning objectives, and skills for an Experience Lab simulation.",
)
def get_experience_metadata(
    experience_slug: str,
    db: Session = Depends(get_db),
) -> ExperienceDetailResponse:
    exp = ExperienceService.get_experience_by_slug(db, experience_slug)
    if not exp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Experience '{experience_slug}' was not found.",
        )
    return exp


@router.get(
    "/experiences/{experience_slug}/scenarios/{scenario_id}",
    response_model=ScenarioPublicResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Scenario Details (Anti-Cheating Protected)",
    description="Retrieve public situation, structured evidence items, and available decision choices for a scenario without revealing outcomes.",
)
def get_scenario_details(
    experience_slug: str,
    scenario_id: str,
    db: Session = Depends(get_db),
) -> ScenarioPublicResponse:
    scenario = ExperienceService.get_public_scenario(db, experience_slug, scenario_id)
    if not scenario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scenario '{scenario_id}' was not found for experience '{experience_slug}'.",
        )
    return scenario


@router.post(
    "/experiences/{experience_slug}/sessions",
    response_model=ExperienceSessionCreateResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Experience Session",
    description="Initialize a new simulation session for an experience track and return the first scenario.",
)
def create_experience_session(
    experience_slug: str,
    db: Session = Depends(get_db),
) -> ExperienceSessionCreateResponse:
    return SimulationService.create_session(db, experience_slug)


@router.get(
    "/experience-sessions/{session_id}",
    response_model=ExperienceSessionStateResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Session State",
    description="Retrieve current active session status, progression sequence, and current scenario.",
)
def get_session_state(
    session_id: str,
    db: Session = Depends(get_db),
) -> ExperienceSessionStateResponse:
    session_state = SimulationService.get_session_state(db, session_id)
    if not session_state:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Experience session '{session_id}' not found.",
        )
    return session_state


@router.post(
    "/experience-sessions/{session_id}/decisions",
    response_model=DecisionOutcomeResponse,
    status_code=status.HTTP_200_OK,
    summary="Submit Scenario Decision",
    description="Submit a tactical decision for the active scenario. Evaluates consequence, updates simulation metrics, and advances scenario.",
)
def submit_scenario_decision(
    session_id: str,
    payload: DecisionSubmitRequest,
    db: Session = Depends(get_db),
) -> DecisionOutcomeResponse:
    return SimulationService.submit_decision(
        db=db,
        session_id=session_id,
        scenario_id=payload.scenario_id,
        decision_id=payload.decision_id,
    )


@router.get(
    "/experience-sessions/{session_id}/result",
    response_model=ExperienceCompletionResultResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Experience Completion Result & Reflection",
    description="Retrieve final simulation score breakdown, timeline of tactical decisions, demonstrated strengths, and self-reflection prompts.",
)
def get_experience_result(
    session_id: str,
    db: Session = Depends(get_db),
) -> ExperienceCompletionResultResponse:
    result = SimulationService.get_session_result(db, session_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Experience session '{session_id}' not found.",
        )
    return result
