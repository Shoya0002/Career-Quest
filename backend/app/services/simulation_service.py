from datetime import datetime, timezone
from typing import Optional, Tuple
from fastapi import HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_

from app.models.experience import (
    Experience,
    Scenario,
    Decision,
    DecisionOutcome,
    ExperienceSession,
    SessionDecisionLog,
)
from app.services.experience_service import ExperienceService
from app.schemas.experience import (
    ExperienceSessionCreateResponse,
    ExperienceSessionStateResponse,
    DecisionOutcomeResponse,
    DecisionOutcomeInfoSchema,
    PerformanceScoreSchema,
    SimpleDecisionSchema,
    SimpleScenarioSchema,
    SimulationProgressSchema,
    ExperienceCompletionResultResponse,
    PerformanceBreakdownSchema,
    DecisionLogItemSchema,
    ReflectionPromptSchema,
)


class SimulationService:
    @staticmethod
    def create_session(db: Session, experience_slug: str) -> ExperienceSessionCreateResponse:
        """
        Initialize a new interactive experience simulation session.
        """
        conditions = [
            Experience.slug == experience_slug,
            Experience.id == experience_slug,
        ]
        if experience_slug in ("software-engineer-incident", "software-engineer", "swe-incident"):
            conditions.append(Experience.slug == "production-incident")
            conditions.append(Experience.id == "exp-swe-incident")

        exp = (
            db.query(Experience)
            .options(joinedload(Experience.scenarios))
            .filter(or_(*conditions))
            .first()
        )

        if not exp:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Experience '{experience_slug}' not found.",
            )

        if not exp.scenarios:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This experience does not contain any configured scenarios.",
            )

        # First scenario in sequence order
        first_scenario = exp.scenarios[0]

        session = ExperienceSession(
            experience_id=exp.id,
            current_scenario_id=first_scenario.id,
            status="in_progress",
            total_score=0,
            technical_score=0,
            reasoning_score=0,
            prioritization_score=0,
            communication_score=0,
            decisions_made=0,
            started_at=datetime.now(timezone.utc),
        )
        db.add(session)
        db.commit()
        db.refresh(session)

        exp_detail = ExperienceService.get_experience_by_slug(db, exp.slug)
        scenario_public = ExperienceService.get_public_scenario(db, exp.slug, first_scenario.id)

        return ExperienceSessionCreateResponse(
            session_id=session.id,
            experience=exp_detail,
            first_scenario=scenario_public,
            current_scenario=scenario_public,
            progress=SimulationProgressSchema(
                current=first_scenario.sequence,
                total=len(exp.scenarios),
            ),
        )

    @staticmethod
    def get_session_state(db: Session, session_id: str) -> Optional[ExperienceSessionStateResponse]:
        """
        Retrieve current active session state, progress, and current scenario without revealing future outcomes.
        """
        session = (
            db.query(ExperienceSession)
            .options(joinedload(ExperienceSession.experience))
            .filter(ExperienceSession.id == session_id)
            .first()
        )
        if not session:
            return None

        exp = session.experience
        total_scenarios = len(exp.scenarios)

        current_scenario_public = None
        current_seq = total_scenarios
        if session.current_scenario_id and session.status == "in_progress":
            current_scenario_public = ExperienceService.get_public_scenario(
                db, exp.slug, session.current_scenario_id
            )
            if current_scenario_public:
                current_seq = current_scenario_public.sequence

        return ExperienceSessionStateResponse(
            session_id=session.id,
            experience_id=session.experience_id,
            status=session.status,
            current_scenario=current_scenario_public,
            progress=SimulationProgressSchema(
                current=current_seq,
                total=total_scenarios,
            ),
            decisions_made=session.decisions_made,
            total_score=session.total_score,
            started_at=session.started_at,
            completed_at=session.completed_at,
        )

    @staticmethod
    def submit_decision(
        db: Session,
        session_id: str,
        scenario_id: str,
        decision_id: str,
    ) -> DecisionOutcomeResponse:
        """
        Process a decision submission, validate state transition, record decision, and resolve consequences.
        """
        session = (
            db.query(ExperienceSession)
            .options(
                joinedload(ExperienceSession.experience).joinedload(Experience.scenarios)
            )
            .filter(ExperienceSession.id == session_id)
            .first()
        )

        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Experience session '{session_id}' not found.",
            )

        if session.status == "completed":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This simulation session has already been completed. Further decisions cannot be submitted.",
            )

        if session.current_scenario_id != scenario_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Scenario '{scenario_id}' does not match the active session scenario.",
            )

        # Validate decision belongs to the scenario
        decision = (
            db.query(Decision)
            .options(
                joinedload(Decision.scenario),
                joinedload(Decision.outcome),
            )
            .filter(Decision.id == decision_id, Decision.scenario_id == scenario_id)
            .first()
        )

        if not decision:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Decision '{decision_id}' is invalid for scenario '{scenario_id}'.",
            )

        outcome = decision.outcome
        if not outcome:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="The chosen decision has no configured simulation outcome.",
            )

        scenario = decision.scenario
        exp = session.experience
        total_scenarios = len(exp.scenarios)

        # Update Session Metrics
        session.total_score += outcome.score_delta
        session.technical_score += outcome.technical_score
        session.reasoning_score += outcome.reasoning_score
        session.prioritization_score += outcome.prioritization_score
        session.communication_score += outcome.communication_score
        session.decisions_made += 1

        # Record Decision Log
        log_entry = SessionDecisionLog(
            session_id=session.id,
            scenario_id=scenario.id,
            scenario_title=scenario.title,
            decision_id=decision.id,
            decision_title=decision.title,
            outcome_title=outcome.title,
            consequence=outcome.consequence,
            feedback=outcome.feedback,
            score_delta=outcome.score_delta,
            created_at=datetime.now(timezone.utc),
        )
        db.add(log_entry)

        # Advance scenario or complete
        is_completed = False
        next_scenario_info = None

        if outcome.next_scenario_id:
            next_scenario = (
                db.query(Scenario)
                .filter(Scenario.id == outcome.next_scenario_id)
                .first()
            )
            if next_scenario:
                session.current_scenario_id = next_scenario.id
                next_scenario_info = ExperienceService.get_public_scenario(
                    db, exp.slug, next_scenario.id
                )
            else:
                # No valid next scenario -> mark completed
                session.status = "completed"
                session.completed_at = datetime.now(timezone.utc)
                session.current_scenario_id = None
                is_completed = True
        else:
            session.status = "completed"
            session.completed_at = datetime.now(timezone.utc)
            session.current_scenario_id = None
            is_completed = True

        db.commit()

        return DecisionOutcomeResponse(
            decision=SimpleDecisionSchema(
                id=decision.id,
                title=decision.title,
            ),
            outcome=DecisionOutcomeInfoSchema(
                title=outcome.title,
                description=outcome.description,
                consequence=outcome.consequence,
                feedback=outcome.feedback,
            ),
            performance=PerformanceScoreSchema(
                score_delta=outcome.score_delta,
                technical=outcome.technical_score,
                reasoning=outcome.reasoning_score,
                prioritization=outcome.prioritization_score,
                communication=outcome.communication_score,
            ),
            next_scenario=next_scenario_info,
            progress=SimulationProgressSchema(
                current=scenario.sequence,
                total=total_scenarios,
            ),
            is_completed=is_completed,
        )

    @staticmethod
    def get_session_result(db: Session, session_id: str) -> Optional[ExperienceCompletionResultResponse]:
        """
        Generate a comprehensive simulation reflection and performance debrief.
        (Reflects authentic professional experience, avoiding suitability scores).
        """
        session = (
            db.query(ExperienceSession)
            .options(
                joinedload(ExperienceSession.experience).joinedload(Experience.skills),
                joinedload(ExperienceSession.experience).joinedload(Experience.reflections),
                joinedload(ExperienceSession.decision_logs),
            )
            .filter(ExperienceSession.id == session_id)
            .first()
        )

        if not session:
            return None

        exp = session.experience

        skills_exercised = [s.skill_name for s in exp.skills]
        decisions_log = [
            DecisionLogItemSchema(
                scenario_title=log.scenario_title,
                decision_title=log.decision_title,
                outcome_title=log.outcome_title,
                consequence=log.consequence,
                feedback=log.feedback,
                score_delta=log.score_delta,
            )
            for log in session.decision_logs
        ]

        # Authentic strengths demonstrated inside this specific scenario
        strengths = []
        if session.technical_score >= 18:
            strengths.append("Strong technical triage using audit logs and database metrics to isolate the root cause.")
        else:
            strengths.append("Solid engagement with real-world operational logs and deployment tools.")

        if session.prioritization_score >= 18:
            strengths.append("High prioritization discipline, acting decisively to protect users before seeking perfection.")
        else:
            strengths.append("Pragmatic focus on system restoration under active production alerts.")

        if session.communication_score >= 18:
            strengths.append("Proactive, transparent communication with non-technical stakeholders during crisis.")

        areas_to_reflect_on = [
            "Consider how rapid rollbacks versus hotfixes balance user trust against developer velocity.",
            "Reflect on the cognitive pressure of making decisions under incomplete operational information.",
            "Notice whether reading deep technical logs felt intellectually stimulating or mentally exhausting.",
        ]

        reflection_prompts = [
            ReflectionPromptSchema(
                id=r.id,
                prompt=r.prompt,
                category=r.category,
            )
            for r in exp.reflections
        ]

        decision_history_list = [
            {
                "scenario_order": idx + 1,
                "scenario_title": log.scenario_title,
                "selected_option_label": chr(65 + (idx % 3)),
                "decision_title": log.decision_title,
                "outcome_headline": log.outcome_title,
                "consequence_text": log.consequence,
                "score_awarded": log.score_delta,
            }
            for idx, log in enumerate(session.decision_logs)
        ]

        breakdown = PerformanceBreakdownSchema(
            technical_score=session.technical_score,
            reasoning_score=session.reasoning_score,
            prioritization_score=session.prioritization_score,
            communication_score=session.communication_score,
            technical_accuracy=min(100, int((session.technical_score / 25) * 100)) if session.technical_score else 85,
            problem_solving=min(100, int((session.reasoning_score / 25) * 100)) if session.reasoning_score else 90,
            collaboration_communication=min(100, int((session.communication_score / 25) * 100)) if session.communication_score else 80,
            stress_management=min(100, int((session.prioritization_score / 25) * 100)) if session.prioritization_score else 85,
        )

        return ExperienceCompletionResultResponse(
            session_id=session.id,
            experience_id=session.experience_id,
            status=session.status,
            total_score=session.total_score,
            final_score=session.total_score,
            performance_breakdown=breakdown,
            scenarios_completed=session.decisions_made,
            skills_exercised=skills_exercised,
            decisions_log=decisions_log,
            decision_history=decision_history_list,
            strengths_demonstrated=strengths,
            areas_to_reflect_on=areas_to_reflect_on,
            reflection_prompts=reflection_prompts,
            summary_message=(
                f"You stepped into the role of a {exp.role} and completed the '{exp.title}' simulation. "
                "You practiced live incident investigation, metric correlation, mitigation execution, "
                "and cross-functional communication under active production constraints."
            ),
        )
