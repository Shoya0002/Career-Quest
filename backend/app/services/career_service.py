import json
import math
from typing import Optional, List
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_, func

from app.models.career import (
    Career,
    CareerSkill,
    CareerPathway,
)
from app.schemas.career import (
    CareerListItemResponse,
    CareerListPaginationResponse,
    CareerDetailResponse,
    AtAGlanceSchema,
    SkillItemSchema,
    SkillsGroupSchema,
    EducationPhaseItemSchema,
    EducationGroupSchema,
    ProgressionStepSchema,
    SpecializationSchema,
    FinancialItemSchema,
    FinancialGroupSchema,
    PracticalConsiderationsSchema,
    OpportunityItemSchema,
    OpportunitiesGroupSchema,
    CareerPathwayResponse,
    PathwayNodeSchema,
    PathwayEdgeSchema,
)


class CareerService:
    @staticmethod
    def get_careers(
        db: Session,
        search: Optional[str] = None,
        category: Optional[str] = None,
        page: int = 1,
        limit: int = 10,
    ) -> CareerListPaginationResponse:
        """
        List careers with search query, category filtering, and pagination.
        """
        query = db.query(Career)

        # Filter by Category
        if category and category.strip():
            query = query.filter(func.lower(Career.category) == category.strip().lower())

        # Search against title, category, tagline, and skills
        if search and search.strip():
            term = f"%{search.strip().lower()}%"
            # Subquery matching skill names
            skill_subquery = (
                db.query(CareerSkill.career_id)
                .filter(func.lower(CareerSkill.skill_name).like(term))
                .scalar_subquery()
            )

            query = query.filter(
                or_(
                    func.lower(Career.title).like(term),
                    func.lower(Career.category).like(term),
                    func.lower(Career.tagline).like(term),
                    func.lower(Career.overview).like(term),
                    Career.id.in_(skill_subquery),
                )
            )

        total = query.count()
        total_pages = math.ceil(total / limit) if limit > 0 else 0

        # Eager load skills for explorer cards key skills
        offset = (page - 1) * limit
        careers = (
            query.options(joinedload(Career.skills))
            .order_by(Career.title.asc())
            .offset(offset)
            .limit(limit)
            .all()
        )

        items: List[CareerListItemResponse] = []
        for c in careers:
            # Extract top 3-4 key skill names
            key_skills = [s.skill_name for s in c.skills[:4]]
            items.append(
                CareerListItemResponse(
                    id=c.id,
                    slug=c.slug,
                    title=c.title,
                    category=c.category,
                    tagline=c.tagline,
                    at_a_glance=AtAGlanceSchema(
                        median_pay=c.median_pay,
                        projected_growth=c.projected_growth,
                        work_life_context=c.work_life_context,
                        stress_context=c.stress_context,
                    ),
                    key_skills=key_skills,
                )
            )

        return CareerListPaginationResponse(
            items=items,
            total=total,
            page=page,
            limit=limit,
            total_pages=total_pages,
        )

    @staticmethod
    def get_career_by_slug(db: Session, career_slug: str) -> Optional[CareerDetailResponse]:
        """
        Retrieve complete structured profile for a career by its slug or ID.
        """
        c = (
            db.query(Career)
            .options(
                joinedload(Career.responsibilities),
                joinedload(Career.skills),
                joinedload(Career.education_paths),
                joinedload(Career.progression),
                joinedload(Career.specializations),
                joinedload(Career.financials),
                joinedload(Career.practical_considerations),
                joinedload(Career.opportunities),
            )
            .filter(or_(Career.slug == career_slug, Career.id == career_slug))
            .first()
        )

        if not c:
            return None

        # Build Skills Group
        tech_skills: List[SkillItemSchema] = []
        prof_skills: List[SkillItemSchema] = []
        for s in c.skills:
            item = SkillItemSchema(
                id=s.id,
                name=s.skill_name,
                importance_score=s.importance_score,
            )
            if s.skill_type == "technical":
                tech_skills.append(item)
            else:
                prof_skills.append(item)

        # Build Education Group
        edu_group = EducationGroupSchema(
            after_class_10=[],
            after_class_12=[],
            entrance_requirements=[],
            certifications=[],
        )
        for ep in c.education_paths:
            item = EducationPhaseItemSchema(
                id=ep.id,
                title=ep.title,
                description=ep.description,
                duration=ep.duration,
                estimated_cost=ep.estimated_cost,
            )
            if ep.phase == "after_class_10":
                edu_group.after_class_10.append(item)
            elif ep.phase == "after_class_12":
                edu_group.after_class_12.append(item)
            elif ep.phase == "entrance_requirements":
                edu_group.entrance_requirements.append(item)
            elif ep.phase == "certifications":
                edu_group.certifications.append(item)

        # Build Progression Steps
        progression_steps: List[ProgressionStepSchema] = [
            ProgressionStepSchema(
                id=p.id,
                level_title=p.level_title,
                experience_range=p.experience_range,
                typical_role=p.typical_role,
                salary_range=p.salary_range,
            )
            for p in c.progression
        ]

        # Build Specializations
        specs: List[SpecializationSchema] = [
            SpecializationSchema(
                id=sp.id,
                title=sp.title,
                description=sp.description,
                market_demand=sp.market_demand,
            )
            for sp in c.specializations
        ]

        # Build Financial Group
        fin_group = FinancialGroupSchema(
            education_cost=[],
            additional_costs=[],
            funding_options=[],
        )
        for f in c.financials:
            item = FinancialItemSchema(
                id=f.id,
                title=f.title,
                amount_or_range=f.amount_or_range,
                notes=f.notes,
            )
            if f.category == "education_cost":
                fin_group.education_cost.append(item)
            elif f.category == "additional_costs":
                fin_group.additional_costs.append(item)
            elif f.category == "funding_options":
                fin_group.funding_options.append(item)

        # Build Practical Considerations
        positives: List[str] = []
        challenges: List[str] = []
        for pc in c.practical_considerations:
            if pc.type in ["positive", "positives"]:
                positives.append(pc.text)
            else:
                challenges.append(pc.text)

        # Build Opportunities Group
        opp_group = OpportunitiesGroupSchema(
            industries=[],
            work_models=[],
            geographic_options=[],
        )
        for opp in c.opportunities:
            item = OpportunityItemSchema(
                id=opp.id,
                name=opp.name,
                description=opp.description,
            )
            if opp.category == "industries":
                opp_group.industries.append(item)
            elif opp.category == "work_models":
                opp_group.work_models.append(item)
            elif opp.category == "geographic_options":
                opp_group.geographic_options.append(item)

        return CareerDetailResponse(
            id=c.id,
            slug=c.slug,
            title=c.title,
            category=c.category,
            tagline=c.tagline,
            overview=c.overview,
            at_a_glance=AtAGlanceSchema(
                median_pay=c.median_pay,
                projected_growth=c.projected_growth,
                work_life_context=c.work_life_context,
                stress_context=c.stress_context,
            ),
            responsibilities=[r.responsibility for r in c.responsibilities],
            skills=SkillsGroupSchema(
                technical=tech_skills,
                professional=prof_skills,
            ),
            education=edu_group,
            progression=progression_steps,
            specializations=specs,
            financial=fin_group,
            practical_considerations=PracticalConsiderationsSchema(
                positives=positives,
                challenges=challenges,
            ),
            opportunities=opp_group,
        )

    @staticmethod
    def get_career_pathway(db: Session, career_slug: str) -> Optional[CareerPathwayResponse]:
        """
        Retrieve structured pathway data for a career.
        """
        c = (
            db.query(Career)
            .filter(or_(Career.slug == career_slug, Career.id == career_slug))
            .first()
        )
        if not c:
            return None

        pathway = (
            db.query(CareerPathway)
            .filter(CareerPathway.career_id == c.id)
            .first()
        )

        if not pathway:
            # Generate a clean standard default pathway if not explicitly saved
            return CareerPathwayResponse(
                career_id=c.id,
                career_slug=c.slug,
                title=f"{c.title} Standard Pathway",
                description=f"Standard academic and professional milestone roadmap for {c.title}.",
                total_duration_years=4.0,
                total_estimated_cost="$40,000 - $120,000",
                expected_breakeven_years=2.5,
                difficulty_score=7,
                nodes=[
                    PathwayNodeSchema(
                        id="node-1",
                        position={"x": 100, "y": 100},
                        data={
                            "title": "Secondary Education (10+2)",
                            "subtitle": "Foundational Science/Math stream",
                            "durationMonths": 24,
                            "estimatedCost": 2000,
                            "nodeType": "education",
                        },
                    ),
                    PathwayNodeSchema(
                        id="node-2",
                        position={"x": 350, "y": 100},
                        data={
                            "title": "Bachelor's Degree",
                            "subtitle": f"Undergraduate preparation for {c.title}",
                            "durationMonths": 48,
                            "estimatedCost": 60000,
                            "nodeType": "education",
                        },
                    ),
                    PathwayNodeSchema(
                        id="node-3",
                        position={"x": 600, "y": 100},
                        data={
                            "title": "Entry-Level Professional Role",
                            "subtitle": "Junior practitioner and apprenticeship",
                            "durationMonths": 24,
                            "estimatedCost": 0,
                            "nodeType": "entry_role",
                        },
                    ),
                ],
                edges=[
                    PathwayEdgeSchema(
                        id="edge-1-2",
                        source="node-1",
                        target="node-2",
                        animated=True,
                    ),
                    PathwayEdgeSchema(
                        id="edge-2-3",
                        source="node-2",
                        target="node-3",
                        animated=True,
                    ),
                ],
            )

        nodes_data = json.loads(pathway.nodes_json) if pathway.nodes_json else []
        edges_data = json.loads(pathway.edges_json) if pathway.edges_json else []

        return CareerPathwayResponse(
            career_id=c.id,
            career_slug=c.slug,
            title=pathway.title,
            description=pathway.description,
            total_duration_years=pathway.total_duration_years,
            total_estimated_cost=pathway.total_estimated_cost,
            expected_breakeven_years=pathway.expected_breakeven_years,
            difficulty_score=pathway.difficulty_score,
            nodes=[PathwayNodeSchema(**n) for n in nodes_data],
            edges=[PathwayEdgeSchema(**e) for e in edges_data],
        )
