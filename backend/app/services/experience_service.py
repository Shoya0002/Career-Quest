from typing import Optional
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_

from app.models.experience import Experience, Scenario
from app.schemas.experience import (
    ExperienceDetailResponse,
    ScenarioPublicResponse,
    EvidencePublicSchema,
    DecisionPublicSchema,
)


class ExperienceService:
    @staticmethod
    def get_experience_by_slug(db: Session, experience_slug: str) -> Optional[ExperienceDetailResponse]:
        """
        Fetch public metadata and skills for a career experience simulation.
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
            .options(
                joinedload(Experience.skills),
                joinedload(Experience.scenarios),
            )
            .filter(or_(*conditions))
            .first()
        )

        if not exp:
            return None

        skills_list = [s.skill_name for s in exp.skills]
        sorted_scenarios = sorted(exp.scenarios, key=lambda s: s.sequence) if exp.scenarios else []
        first_scenario = None
        if sorted_scenarios:
            first_scenario = ExperienceService.get_public_scenario(db, exp.slug, sorted_scenarios[0].id)

        return ExperienceDetailResponse(
            id=exp.id,
            career_id=exp.career_id,
            slug=exp.slug,
            title=exp.title,
            description=exp.description,
            role=exp.role,
            role_title=exp.role,
            tagline="Triage live telemetry, isolate root causes, and mitigate a critical production incident under pressure.",
            briefing=exp.description,
            organization="Global CloudCommerce",
            category="Technology",
            estimated_duration=exp.estimated_duration,
            difficulty=exp.difficulty,
            learning_objective=exp.learning_objective,
            skills=skills_list,
            scenarios_count=len(exp.scenarios),
            total_scenarios=len(exp.scenarios),
            first_scenario=first_scenario,
        )

    @staticmethod
    def get_public_scenario(db: Session, experience_slug: str, scenario_id: str) -> Optional[ScenarioPublicResponse]:
        """
        Fetch a scenario by ID, returning only public situation, evidence, and available decisions.
        ANTI-CHEATING GUARANTEE: Hidden outcomes, scores, and branches are stripped out.
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
            .filter(or_(*conditions))
            .first()
        )
        if not exp:
            return None

        scenario = (
            db.query(Scenario)
            .options(
                joinedload(Scenario.evidence_items),
                joinedload(Scenario.decisions),
            )
            .filter(Scenario.experience_id == exp.id, Scenario.id == scenario_id)
            .first()
        )

        if not scenario:
            return None

        evidence_schemas = [
            EvidencePublicSchema(
                id=e.id,
                title=e.title,
                type=e.type,
                content=e.content,
                preview_text=e.content[:140] if e.content else "",
                full_content=e.content,
                importance=e.importance,
                display_order=getattr(e, "display_order", idx),
            )
            for idx, e in enumerate(scenario.evidence_items)
        ]

        # Decisions list contains ONLY public title and description (anti-cheating)
        decision_schemas = [
            DecisionPublicSchema(
                id=d.id,
                title=d.title,
                description=d.description,
                option_label=chr(65 + idx),
                display_order=getattr(d, "display_order", idx),
            )
            for idx, d in enumerate(scenario.decisions)
        ]

        return ScenarioPublicResponse(
            id=scenario.id,
            experience_id=scenario.experience_id,
            sequence=scenario.sequence,
            sequence_order=scenario.sequence,
            title=scenario.title,
            situation=scenario.situation,
            situation_brief=scenario.situation,
            description=scenario.description,
            evidence=evidence_schemas,
            evidence_items=evidence_schemas,
            decisions=decision_schemas,
        )
