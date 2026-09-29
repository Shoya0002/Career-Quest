from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session

from app.models.career import Career
from app.schemas.comparison import (
    CareerSummaryHeader,
    DimensionValue,
    ComparisonDimension,
    TradeOffItem,
    CareerComparisonResponse,
)


class ComparisonService:
    """
    Deterministic Comparison Engine:
    Extracts, normalizes, and compares structured dimensions between two careers
    without ranking, scoring, or declaring a winner.
    """

    SUPPORTED_DIMENSIONS = [
        {"key": "overview", "label": "Overview & Professional Scope"},
        {"key": "education", "label": "Education Path"},
        {"key": "education_duration", "label": "Education Duration"},
        {"key": "education_cost", "label": "Education Cost"},
        {"key": "skills", "label": "Core Skills"},
        {"key": "work_environment", "label": "Work Environment & Stress Context"},
        {"key": "career_progression", "label": "Career Progression"},
        {"key": "specializations", "label": "Specializations"},
        {"key": "work_models", "label": "Work Models & Flexibility"},
        {"key": "geographic_opportunities", "label": "Geographic Opportunities & Hubs"},
        {"key": "practical_considerations", "label": "Practical Considerations & Trade-Offs"},
        {"key": "funding_considerations", "label": "Funding Considerations & Financial Aid"},
    ]

    def compare_careers(
        self,
        db: Session,
        career_a_slug: str,
        career_b_slug: str,
        dimension_filter: Optional[List[str]] = None,
    ) -> Optional[CareerComparisonResponse]:
        # 1. Fetch careers by slug
        career_a = db.query(Career).filter(Career.slug == career_a_slug.strip().lower()).first()
        career_b = db.query(Career).filter(Career.slug == career_b_slug.strip().lower()).first()

        if not career_a or not career_b:
            return None

        # 2. Extract dimensions
        dimensions: List[ComparisonDimension] = []
        for dim_meta in self.SUPPORTED_DIMENSIONS:
            key = dim_meta["key"]
            if dimension_filter and key not in dimension_filter:
                continue

            val_a = self._extract_dimension_value(career_a, key)
            val_b = self._extract_dimension_value(career_b, key)

            dimensions.append(
                ComparisonDimension(
                    key=key,
                    label=dim_meta["label"],
                    career_a=val_a,
                    career_b=val_b,
                )
            )

        # 3. Generate factual, neutral trade-offs
        trade_offs = self._generate_trade_offs(career_a, career_b)

        return CareerComparisonResponse(
            career_a=CareerSummaryHeader(
                id=str(career_a.id),
                slug=career_a.slug,
                title=career_a.title,
                category=career_a.category,
                tagline=career_a.tagline,
            ),
            career_b=CareerSummaryHeader(
                id=str(career_b.id),
                slug=career_b.slug,
                title=career_b.title,
                category=career_b.category,
                tagline=career_b.tagline,
            ),
            dimensions=dimensions,
            trade_offs=trade_offs,
            source={
                "name": "CareerQuest Comprehensive Career Registry (Prototype Data)",
                "url": "https://demo.careerquest.org/sources/careers",
                "verified": False,
                "is_mock": True,
            },
            disclaimer=(
                "Career comparison data is strictly informational and intended to highlight structured trade-offs. "
                "CareerQuest does not declare winners, compute suitability scores, or rank career paths."
            ),
        )

    def _extract_dimension_value(self, career: Career, dimension_key: str) -> DimensionValue:
        if dimension_key == "overview":
            details = [
                career.overview,
                f"Median Compensation: {career.median_pay}",
                f"Projected Growth: {career.projected_growth}",
            ]
            return DimensionValue(
                value=career.tagline,
                details=details,
                data_available=bool(career.overview),
            )

        elif dimension_key == "education":
            edu_paths = career.education_paths or []
            if not edu_paths:
                return DimensionValue(value=None, details=[], data_available=False)
            primary_path = next((ep.title for ep in edu_paths if ep.phase == "after_class_12"), edu_paths[0].title)
            details = [f"{ep.title}: {ep.description}" for ep in edu_paths]
            return DimensionValue(
                value=primary_path,
                details=details,
                data_available=True,
            )

        elif dimension_key == "education_duration":
            edu_paths = career.education_paths or []
            durations = [f"{ep.title}: {ep.duration}" for ep in edu_paths if ep.duration]
            if not durations:
                return DimensionValue(value=None, details=[], data_available=False)
            # Find representative degree duration
            primary_duration = next((ep.duration for ep in edu_paths if ep.phase == "after_class_12"), durations[0])
            return DimensionValue(
                value=f"Typical Degree Phase: {primary_duration}",
                details=durations,
                data_available=True,
            )

        elif dimension_key == "education_cost":
            fin_costs = [
                f"{fin.title}: {fin.amount_or_range} ({fin.notes})"
                for fin in (career.financials or [])
                if fin.category in ["education_cost", "additional_costs"]
            ]
            edu_costs = [f"{ep.title}: {ep.estimated_cost}" for ep in (career.education_paths or []) if ep.estimated_cost]
            all_costs = fin_costs + edu_costs
            if not all_costs:
                return DimensionValue(value=None, details=[], data_available=False)
            return DimensionValue(
                value=fin_costs[0] if fin_costs else all_costs[0],
                details=all_costs,
                data_available=True,
            )

        elif dimension_key == "skills":
            skills = career.skills or []
            if not skills:
                return DimensionValue(value=None, details=[], data_available=False)
            tech_skills = [s.skill_name for s in skills if s.skill_type == "technical"]
            prof_skills = [s.skill_name for s in skills if s.skill_type == "professional"]
            details = [f"{s.skill_name} ({s.skill_type.title()} · Score: {s.importance_score}/10)" for s in skills]
            summary_val = f"Top Skills: {', '.join(tech_skills[:3])} + {', '.join(prof_skills[:2])}"
            return DimensionValue(
                value=summary_val,
                details=details,
                data_available=True,
                metadata={"technical_count": len(tech_skills), "professional_count": len(prof_skills)},
            )

        elif dimension_key == "work_environment":
            if not career.work_life_context and not career.stress_context:
                return DimensionValue(value=None, details=[], data_available=False)
            details = [
                f"Work-Life Dynamics: {career.work_life_context}",
                f"Operational Stress Factors: {career.stress_context}",
            ]
            return DimensionValue(
                value=career.work_life_context,
                details=details,
                data_available=True,
            )

        elif dimension_key == "career_progression":
            progression = career.progression or []
            if not progression:
                return DimensionValue(value=None, details=[], data_available=False)
            details = [
                f"{p.level_title} ({p.experience_range}): {p.typical_role} · Compensation: {p.salary_range}"
                for p in progression
            ]
            span_val = f"{progression[0].level_title} → {progression[-1].level_title}"
            return DimensionValue(
                value=span_val,
                details=details,
                data_available=True,
            )

        elif dimension_key == "specializations":
            specs = career.specializations or []
            if not specs:
                return DimensionValue(value=None, details=[], data_available=False)
            details = [f"{s.title} (Market Demand: {s.market_demand}): {s.description}" for s in specs]
            return DimensionValue(
                value=f"{len(specs)} Key Specialization Tracks",
                details=details,
                data_available=True,
            )

        elif dimension_key == "work_models":
            opps = [
                f"{o.name}: {o.description}"
                for o in (career.opportunities or [])
                if o.category == "work_models"
            ]
            if not opps:
                return DimensionValue(value=None, details=[], data_available=False)
            return DimensionValue(
                value=opps[0].split(":")[0],
                details=opps,
                data_available=True,
            )

        elif dimension_key == "geographic_opportunities":
            opps = [
                f"{o.name}: {o.description}"
                for o in (career.opportunities or [])
                if o.category == "geographic_options"
            ]
            if not opps:
                return DimensionValue(value=None, details=[], data_available=False)
            return DimensionValue(
                value=opps[0],
                details=opps,
                data_available=True,
            )

        elif dimension_key == "practical_considerations":
            pcs = career.practical_considerations or []
            if not pcs:
                return DimensionValue(value=None, details=[], data_available=False)
            details = [f"[{pc.type.upper()}] {pc.text}" for pc in pcs]
            pos_count = sum(1 for pc in pcs if pc.type == "positive")
            chal_count = sum(1 for pc in pcs if pc.type == "challenge")
            return DimensionValue(
                value=f"{pos_count} Advantages vs {chal_count} Challenges identified",
                details=details,
                data_available=True,
            )

        elif dimension_key == "funding_considerations":
            fins = [
                f"{fin.title}: {fin.amount_or_range} ({fin.notes})"
                for fin in (career.financials or [])
                if fin.category == "funding_options"
            ]
            if not fins:
                return DimensionValue(value=None, details=[], data_available=False)
            return DimensionValue(
                value=f"{len(fins)} Identified Funding Mechanisms",
                details=fins,
                data_available=True,
            )

        return DimensionValue(value=None, details=[], data_available=False)

    def _generate_trade_offs(self, career_a: Career, career_b: Career) -> List[TradeOffItem]:
        """Generate objective, factual trade-off contrasts between the two careers."""
        trade_offs = []

        # 1. Education & Training Pathway
        trade_offs.append(
            TradeOffItem(
                dimension="education",
                label="Education & Licensing Requirements",
                summary=(
                    f"{career_a.title} pathways emphasize foundational degrees ({career_a.category}) with flexible alternative entry routes, "
                    f"whereas {career_b.title} pathways require formal professional degree accreditation and statutory licensing."
                ),
            )
        )

        # 2. Work Environment & Operating Models
        trade_offs.append(
            TradeOffItem(
                dimension="work_environment",
                label="Work Environment & Flexibility",
                summary=(
                    f"{career_a.title} typically offers high remote/hybrid autonomy centered around engineering sprints and deployment cycles. "
                    f"{career_b.title} involves high-touch client counseling, statutory deadlines, and structured office/institutional settings."
                ),
            )
        )

        # 3. Core Competency Focus
        trade_offs.append(
            TradeOffItem(
                dimension="skills",
                label="Core Competencies & Reasoning Style",
                summary=(
                    f"{career_a.title} centers on algorithmic logic, systems architecture, and continuous technological iteration. "
                    f"{career_b.title} centers on statutory interpretation, case law analysis, and persuasive argumentation."
                ),
            )
        )

        # 4. Career Progression Model
        trade_offs.append(
            TradeOffItem(
                dimension="career_progression",
                label="Progression & Seniority Milestones",
                summary=(
                    f"{career_a.title} progression advances through technical individual contributor (IC) or management ladders. "
                    f"{career_b.title} progression follows traditional associate-to-equity-partner or corporate in-house counsel hierarchies."
                ),
            )
        )

        return trade_offs
