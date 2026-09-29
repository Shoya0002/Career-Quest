import json
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.career import Career
from app.models.what_if import PathwayOption


def seed_what_if_pathways(db: Session = None):
    """
    Seed structured pathway options for the Software Engineer What-If career simulator.
    """
    owns_session = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        owns_session = True

    try:
        swe = db.query(Career).filter(Career.id == "software-engineer").first()
        if not swe:
            print("Software Engineer career not found. Please seed careers first.")
            return

        # Clean up existing options for fresh seed
        db.query(PathwayOption).filter(PathwayOption.career_id == swe.id).delete()
        db.commit()

        # -------------------------------------------------------------------------
        # PATH A: Traditional B.Tech in Computer Science
        # -------------------------------------------------------------------------
        nodes_btech = [
            {"id": "node-1", "position": {"x": 50, "y": 120}, "data": {"title": "Class 12 Science (PCM)", "subtitle": "JEE / State CET Entrance Prep", "durationMonths": 24, "estimatedCost": 50000, "nodeType": "education"}},
            {"id": "node-2", "position": {"x": 350, "y": 120}, "data": {"title": "4-Year B.Tech in CS", "subtitle": "Core Algorithms, Networks & OS", "durationMonths": 48, "estimatedCost": 1400000, "nodeType": "education"}},
            {"id": "node-3", "position": {"x": 650, "y": 120}, "data": {"title": "Campus Placement / Internship", "subtitle": "Software Engineer Intern", "durationMonths": 6, "estimatedCost": 0, "nodeType": "internship"}},
            {"id": "node-4", "position": {"x": 950, "y": 120}, "data": {"title": "Junior Software Engineer", "subtitle": "Full-time production engineer", "durationMonths": 24, "estimatedCost": 0, "nodeType": "entry_role"}},
        ]
        edges_btech = [
            {"id": "e1-2", "source": "node-1", "target": "node-2", "animated": True},
            {"id": "e2-3", "source": "node-2", "target": "node-3", "animated": True},
            {"id": "e3-4", "source": "node-3", "target": "node-4", "animated": True},
        ]
        path_a = PathwayOption(
            id="path-swe-btech",
            career_id=swe.id,
            slug="traditional-btech",
            title="Traditional B.Tech / B.E. in Computer Science",
            description="Four-year comprehensive engineering degree covering operating systems, compilers, computer architecture, and distributed systems.",
            education_path="btech",
            estimated_duration_years=4.0,
            annual_estimated_cost=350000.0,
            cost_label="₹3,50,000 / yr [prototype_estimate]",
            currency="INR",
            location_type="India",
            study_abroad_supported=False,
            prerequisites="Class 12 Science (PCM) with minimum 60% aggregate and entrance qualification (JEE/State CET)",
            next_steps="Campus Placements / Software Engineering Internships -> Junior Software Engineer",
            nodes_json=json.dumps(nodes_btech),
            edges_json=json.dumps(edges_btech),
            is_prototype_estimate=True,
        )
        db.add(path_a)

        # -------------------------------------------------------------------------
        # PATH B: B.Sc in Computer Science / Information Technology
        # -------------------------------------------------------------------------
        nodes_bsc = [
            {"id": "node-1", "position": {"x": 50, "y": 120}, "data": {"title": "Class 12 (Math/Science)", "subtitle": "Direct College Admissions", "durationMonths": 24, "estimatedCost": 30000, "nodeType": "education"}},
            {"id": "node-2", "position": {"x": 350, "y": 120}, "data": {"title": "3-Year B.Sc Computer Science", "subtitle": "Programming, Web Tech & DBMS", "durationMonths": 36, "estimatedCost": 360000, "nodeType": "education"}},
            {"id": "node-3", "position": {"x": 650, "y": 120}, "data": {"title": "Open Source & Portfolio Sprint", "subtitle": "Full-Stack projects on GitHub", "durationMonths": 6, "estimatedCost": 15000, "nodeType": "certification"}},
            {"id": "node-4", "position": {"x": 950, "y": 120}, "data": {"title": "Junior Developer / Analyst", "subtitle": "Direct industry entry", "durationMonths": 24, "estimatedCost": 0, "nodeType": "entry_role"}},
        ]
        edges_bsc = [
            {"id": "e1-2", "source": "node-1", "target": "node-2", "animated": True},
            {"id": "e2-3", "source": "node-2", "target": "node-3", "animated": True},
            {"id": "e3-4", "source": "node-3", "target": "node-4", "animated": True},
        ]
        path_b = PathwayOption(
            id="path-swe-bsc",
            career_id=swe.id,
            slug="bsc-computer-science",
            title="B.Sc in Computer Science & Applied Software",
            description="Three-year foundational degree focusing on programming, database management, and web applications with lower annual tuition.",
            education_path="bsc",
            estimated_duration_years=3.0,
            annual_estimated_cost=120000.0,
            cost_label="₹1,20,000 / yr [prototype_estimate]",
            currency="INR",
            location_type="India",
            study_abroad_supported=False,
            prerequisites="Class 12 with Mathematics / Computer Science",
            next_steps="Open-source portfolio development & Junior Full-Stack Developer recruitment",
            nodes_json=json.dumps(nodes_bsc),
            edges_json=json.dumps(edges_bsc),
            is_prototype_estimate=True,
        )
        db.add(path_b)

        # -------------------------------------------------------------------------
        # PATH C: Alternative Skill-Based Accelerated Bootcamp
        # -------------------------------------------------------------------------
        nodes_alt = [
            {"id": "node-1", "position": {"x": 50, "y": 120}, "data": {"title": "Foundational Self-Study", "subtitle": "Python & JavaScript basics", "durationMonths": 3, "estimatedCost": 0, "nodeType": "education"}},
            {"id": "node-2", "position": {"x": 350, "y": 120}, "data": {"title": "Full-Stack Bootcamp & Diploma", "subtitle": "Intensive project-based sprint", "durationMonths": 9, "estimatedCost": 60000, "nodeType": "certification"}},
            {"id": "node-3", "position": {"x": 650, "y": 120}, "data": {"title": "Startup Apprenticeship", "subtitle": "Real codebase contributions", "durationMonths": 6, "estimatedCost": 0, "nodeType": "internship"}},
            {"id": "node-4", "position": {"x": 950, "y": 120}, "data": {"title": "Junior Frontend / Backend Developer", "subtitle": "Startup engineering hire", "durationMonths": 18, "estimatedCost": 0, "nodeType": "entry_role"}},
        ]
        edges_alt = [
            {"id": "e1-2", "source": "node-1", "target": "node-2", "animated": True},
            {"id": "e2-3", "source": "node-2", "target": "node-3", "animated": True},
            {"id": "e3-4", "source": "node-3", "target": "node-4", "animated": True},
        ]
        path_c = PathwayOption(
            id="path-swe-alt",
            career_id=swe.id,
            slug="alternative-bootcamp",
            title="Alternative Skill-Based Bootcamp & Apprenticeship",
            description="Intensive 12-18 month software development immersion with direct portfolio building and startup apprenticeship placement.",
            education_path="alternative",
            estimated_duration_years=1.5,
            annual_estimated_cost=45000.0,
            cost_label="₹45,000 / yr [prototype_estimate]",
            currency="INR",
            location_type="India",
            study_abroad_supported=False,
            prerequisites="Basic logic, problem solving, and personal computer access",
            next_steps="Junior Developer hiring at agile technology startups",
            nodes_json=json.dumps(nodes_alt),
            edges_json=json.dumps(edges_alt),
            is_prototype_estimate=True,
        )
        db.add(path_c)

        # -------------------------------------------------------------------------
        # PATH D: International B.S. in Computer Science (Study Abroad)
        # -------------------------------------------------------------------------
        nodes_abroad = [
            {"id": "node-1", "position": {"x": 50, "y": 120}, "data": {"title": "High School + SAT / IELTS", "subtitle": "International University Prep", "durationMonths": 24, "estimatedCost": 80000, "nodeType": "education"}},
            {"id": "node-2", "position": {"x": 350, "y": 120}, "data": {"title": "4-Year International B.S. in CS", "subtitle": "Global tech curriculum & research", "durationMonths": 48, "estimatedCost": 9600000, "nodeType": "education"}},
            {"id": "node-3", "position": {"x": 650, "y": 120}, "data": {"title": "Global Summer Tech Internship", "subtitle": "FAANG / Multi-national intern", "durationMonths": 3, "estimatedCost": 0, "nodeType": "internship"}},
            {"id": "node-4", "position": {"x": 950, "y": 120}, "data": {"title": "Global Software Engineer (OPT/Visa)", "subtitle": "International entry role", "durationMonths": 36, "estimatedCost": 0, "nodeType": "entry_role"}},
        ]
        edges_abroad = [
            {"id": "e1-2", "source": "node-1", "target": "node-2", "animated": True},
            {"id": "e2-3", "source": "node-2", "target": "node-3", "animated": True},
            {"id": "e3-4", "source": "node-3", "target": "node-4", "animated": True},
        ]
        path_d = PathwayOption(
            id="path-swe-abroad",
            career_id=swe.id,
            slug="study-abroad-bs",
            title="International B.S. in Computer Science (Global Campus)",
            description="Four-year undergraduate degree at an accredited international university (US, Germany, Canada, or Singapore) with OPT work authorization.",
            education_path="btech",
            estimated_duration_years=4.0,
            annual_estimated_cost=2400000.0,
            cost_label="₹24,00,000 / yr [prototype_estimate]",
            currency="INR",
            location_type="Abroad",
            study_abroad_supported=True,
            prerequisites="High school academic transcripts, standardized tests (SAT/ACT), and language tests (TOEFL/IELTS)",
            next_steps="Global tech company recruitment & international work authorization pathway",
            nodes_json=json.dumps(nodes_abroad),
            edges_json=json.dumps(edges_abroad),
            is_prototype_estimate=True,
        )
        db.add(path_d)

        db.commit()
        print("Successfully seeded 4 What-If pathway options for Software Engineer!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding What-If pathways: {e}")
        raise e
    finally:
        if owns_session:
            db.close()


if __name__ == "__main__":
    seed_what_if_pathways()
