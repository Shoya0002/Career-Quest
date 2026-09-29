import json
from typing import List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.career import Career
from app.models.what_if import PathwayOption
from app.services.career_service import CareerService
from app.schemas.career import PathwayNodeSchema, PathwayEdgeSchema
from app.schemas.what_if import (
    WhatIfRequest,
    WhatIfResponse,
    WhatIfResultGroupSchema,
    PathwayOptionSchema,
    PathwayChangeExplanationSchema,
    SimpleCareerHeaderSchema,
    LocationEnum,
)


class WhatIfService:
    @staticmethod
    def calculate_what_if(
        db: Session,
        career_slug: str,
        request: WhatIfRequest,
    ) -> WhatIfResponse:
        """
        Deterministic constraint evaluation engine.
        Evaluates user personal/financial constraints against available career pathway options
        WITHOUT mutating base career data or generating career recommendations.
        """
        # 1. Load Career
        career = (
            db.query(Career)
            .filter(or_(Career.slug == career_slug, Career.id == career_slug))
            .first()
        )
        if not career:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Career '{career_slug}' was not found.",
            )

        # 2. Load Base Default Pathway (read-only)
        base_pathway = CareerService.get_career_pathway(db, career.slug)

        # 3. Query All Pathway Options for this Career
        options = (
            db.query(PathwayOption)
            .filter(PathwayOption.career_id == career.id)
            .all()
        )

        available: List[PathwayOptionSchema] = []
        requires_funding: List[PathwayOptionSchema] = []
        affected: List[PathwayOptionSchema] = []
        excluded: List[PathwayOptionSchema] = []
        changes: List[PathwayChangeExplanationSchema] = []

        # 4. Deterministic Evaluation
        for opt in options:
            nodes_data = json.loads(opt.nodes_json) if opt.nodes_json else []
            edges_data = json.loads(opt.edges_json) if opt.edges_json else []

            opt_schema = PathwayOptionSchema(
                id=opt.id,
                title=opt.title,
                description=opt.description,
                education_path=opt.education_path,
                estimated_duration_years=opt.estimated_duration_years,
                annual_estimated_cost=opt.annual_estimated_cost,
                cost_label=opt.cost_label,
                currency=opt.currency,
                location_type=opt.location_type,
                study_abroad_supported=opt.study_abroad_supported,
                prerequisites=opt.prerequisites,
                next_steps=opt.next_steps,
                is_prototype_estimate=opt.is_prototype_estimate,
                nodes=[PathwayNodeSchema(**n) for n in nodes_data],
                edges=[PathwayEdgeSchema(**e) for e in edges_data],
            )

            # Check Location / Study Abroad
            is_abroad_option = opt.location_type == "Abroad" or opt.study_abroad_supported
            if is_abroad_option and not request.study_abroad and request.preferred_location == LocationEnum.INDIA:
                excluded.append(opt_schema)
                changes.append(
                    PathwayChangeExplanationSchema(
                        pathway_id=opt.id,
                        pathway_title=opt.title,
                        change_type="location_mismatch",
                        reason="International pathway excluded because study abroad is disabled and preferred location is India.",
                        suggested_actions=["Enable 'Study Abroad' in constraints to explore international dual-degree routes."],
                    )
                )
                continue

            # Check Track match
            is_selected_track = opt.education_path == request.education_path.value
            budget_gap = max(0.0, opt.annual_estimated_cost - request.education_budget)

            if is_selected_track:
                if request.education_budget >= opt.annual_estimated_cost:
                    available.append(opt_schema)
                    changes.append(
                        PathwayChangeExplanationSchema(
                            pathway_id=opt.id,
                            pathway_title=opt.title,
                            change_type="compatible",
                            reason=f"The selected annual budget of {request.currency} {request.education_budget:,.0f} fully covers the estimated annual cost ({opt.cost_label}).",
                            funding_gap=0.0,
                            suggested_actions=["Eligible for direct enrollment without mandatory financing requirements."],
                        )
                    )
                else:
                    requires_funding.append(opt_schema)
                    changes.append(
                        PathwayChangeExplanationSchema(
                            pathway_id=opt.id,
                            pathway_title=opt.title,
                            change_type="requires_funding",
                            reason=f"The selected annual budget of {request.currency} {request.education_budget:,.0f} is below the prototype estimate ({opt.cost_label}). Estimated annual funding gap is {request.currency} {budget_gap:,.0f}.",
                            funding_gap=budget_gap,
                            suggested_actions=[
                                "Apply for merit and need-based STEM scholarships.",
                                "Explore government education loan schemes with post-completion moratorium.",
                                "Consider paid industry co-ops and summer internships to offset upper-year tuition.",
                            ],
                        )
                    )
            else:
                # Alternative academic models (e.g. B.Sc or Bootcamp when B.Tech was selected)
                if request.education_budget >= opt.annual_estimated_cost:
                    affected.append(opt_schema)
                    changes.append(
                        PathwayChangeExplanationSchema(
                            pathway_id=opt.id,
                            pathway_title=opt.title,
                            change_type="alternative_recommendation",
                            reason=f"Alternative pathway available: Fits within your annual budget of {request.currency} {request.education_budget:,.0f} ({opt.cost_label}).",
                            funding_gap=0.0,
                            suggested_actions=["Examine curriculum alignment and industry recruitment statistics for this alternative pathway."],
                        )
                    )
                else:
                    excluded.append(opt_schema)
                    changes.append(
                        PathwayChangeExplanationSchema(
                            pathway_id=opt.id,
                            pathway_title=opt.title,
                            change_type="path_mismatch",
                            reason=f"Non-selected academic track ({opt.education_path}) and exceeds current annual budget.",
                            funding_gap=budget_gap,
                        )
                    )

        # 5. Build Objective Summary
        summary_lines = []
        if available:
            summary_lines.append(f"{len(available)} pathway(s) directly match your budget and location preferences.")
        if requires_funding:
            summary_lines.append(f"{len(requires_funding)} target pathway(s) remain viable with scholarship or education loan financing.")
        if affected:
            summary_lines.append(f"{len(affected)} alternative pathway option(s) fit within your current budget parameters.")

        summary_text = " ".join(summary_lines) if summary_lines else "No pathways perfectly match all strict criteria without adjustments."

        return WhatIfResponse(
            career=SimpleCareerHeaderSchema(
                id=career.id,
                title=career.title,
            ),
            inputs=request,
            base_pathway=base_pathway,
            result=WhatIfResultGroupSchema(
                available=available,
                requires_funding=requires_funding,
                affected=affected,
                excluded=excluded,
            ),
            changes=changes,
            summary=summary_text,
        )
