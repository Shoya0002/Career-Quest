import json
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.career import (
    Career,
    CareerResponsibility,
    CareerSkill,
    CareerEducationPath,
    CareerProgression,
    CareerSpecialization,
    CareerFinancial,
    CareerPracticalConsideration,
    CareerOpportunity,
    CareerPathway,
)
from app.seed.experiences import seed_experiences
from app.seed.what_if import seed_what_if_pathways
from app.seed.funding import seed_funding_options


def seed_database(db: Session = None):
    """
    Seed the database with 8 structured careers, featuring Software Engineer as the Golden Career.
    """
    owns_session = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        owns_session = True

    try:
        # Check if already seeded
        existing_count = db.query(Career).count()
        if existing_count > 0:
            print(f"Database already contains {existing_count} careers. Cleaning up for fresh seed...")
            db.query(CareerPathway).delete()
            db.query(CareerOpportunity).delete()
            db.query(CareerPracticalConsideration).delete()
            db.query(CareerFinancial).delete()
            db.query(CareerSpecialization).delete()
            db.query(CareerProgression).delete()
            db.query(CareerEducationPath).delete()
            db.query(CareerSkill).delete()
            db.query(CareerResponsibility).delete()
            db.query(Career).delete()
            db.commit()

        # =========================================================================
        # 1. SOFTWARE ENGINEER — GOLDEN CAREER (COMPLETE)
        # =========================================================================
        swe = Career(
            id="software-engineer",
            slug="software-engineer",
            title="Software Engineer",
            category="Technology",
            tagline="Architect and build scalable systems powering the modern world",
            overview=(
                "Software Engineers apply mathematical and computer science principles to design, develop, "
                "test, and optimize software applications, cloud platforms, and distributed systems. "
                "From microservices handling millions of concurrent requests to intuitive user interfaces, "
                "software engineering bridges abstract algorithms with real-world human solutions."
            ),
            median_pay="$132,000 / yr (US Median) · ₹12,00,000 - ₹28,00,000 / yr (India Mid-Tier to Tech Hubs) [Illustrative / Prototype data]",
            projected_growth="25% projected growth (2022-2032 · Much faster than average)",
            work_life_context="High autonomy; widespread hybrid and remote flexibility; intense sprint deliverables and on-call rotations for critical production services.",
            stress_context="Moderate to high during live service degradation, critical security patches, and compressed launch deadlines.",
        )
        db.add(swe)
        db.flush()

        # Responsibilities
        swe_responsibilities = [
            "Architect and write clean, maintainable, and testable code in modern languages (TypeScript, Python, Go, Rust, Java)",
            "Design scalable relational and NoSQL database schemas and optimize query latencies",
            "Participate in asynchronous peer code reviews and collaborate on architectural RFCs",
            "Instrument automated CI/CD pipelines, containerized deployments, and observability metrics",
            "Investigate production anomalies, perform root-cause analysis, and publish post-mortem documentation",
            "Collaborate closely with product managers, UX designers, and site reliability engineers",
        ]
        for idx, resp in enumerate(swe_responsibilities):
            db.add(CareerResponsibility(career_id=swe.id, responsibility=resp, display_order=idx))

        # Skills
        swe_skills = [
            ("Data Structures & Algorithms", "technical", 9),
            ("Distributed System Architecture", "technical", 9),
            ("Modern Programming (TypeScript/Python/Go)", "technical", 9),
            ("Database Engineering (PostgreSQL/Redis/Kafka)", "technical", 8),
            ("Cloud & DevOps (Docker, Kubernetes, AWS/GCP)", "technical", 8),
            ("Automated Testing & TDD", "technical", 8),
            ("Collaborative Problem Solving", "professional", 9),
            ("Technical Communication & RFC Writing", "professional", 8),
            ("High-Pressure Incident Triage", "professional", 8),
            ("Continuous Learning & Curiosity", "professional", 9),
        ]
        for idx, (name, stype, score) in enumerate(swe_skills):
            db.add(CareerSkill(career_id=swe.id, skill_name=name, skill_type=stype, importance_score=score, display_order=idx))

        # Education
        swe_edu = [
            ("after_class_10", "Class 11-12 Science Stream (PCM/CS)", "Focus on Mathematics, Physics, and Computer Science fundamentals.", "2 Years", "Standard School Tuition"),
            ("after_class_12", "B.Tech / B.E. / B.S. in Computer Science or Software Engineering", "Core curriculum covering OS, Compilers, Networks, DBMS, and Software Engineering principles.", "4 Years", "$40,000 - $180,000 (US) / ₹4L - ₹20L (India)"),
            ("after_class_12", "Alternative Pathway: Intensive Coding Bootcamps & CS Minor", "Accelerated full-stack and cloud engineering immersion with project portfolio focus.", "6 - 12 Months", "$12,000 - $25,000"),
            ("entrance_requirements", "Standardized Entrance & Admissions", "JEE Main/Advanced, SAT/ACT, AP Computer Science, and university coding portfolio evaluation.", "Varies", "$100 - $500 application fees"),
            ("certifications", "AWS Certified Solutions Architect / CKA (Kubernetes Administrator)", "Industry-standard cloud deployment and infrastructure verification.", "3 - 6 Months prep", "$150 - $375 per exam"),
        ]
        for idx, (phase, title, desc, duration, cost) in enumerate(swe_edu):
            db.add(CareerEducationPath(career_id=swe.id, phase=phase, title=title, description=desc, duration=duration, estimated_cost=cost, display_order=idx))

        # Progression
        swe_prog = [
            ("Associate / Junior Software Engineer", "0 - 2 Years", "Feature implementation, bug remediation, unit test coverage", "$85,000 - $110,000"),
            ("Mid-Level Software Engineer", "2 - 5 Years", "End-to-end component ownership, service design, mentoring juniors", "$115,000 - $150,000"),
            ("Senior Software Engineer", "5 - 8 Years", "Subsystem architecture, cross-team technical alignment, reliability leadership", "$155,000 - $210,000"),
            ("Staff / Principal Software Engineer", "8+ Years", "Organization-wide technical strategy, multi-year platform bets, executive advisory", "$220,000 - $350,000+"),
        ]
        for idx, (lvl, exp, role, sal) in enumerate(swe_prog):
            db.add(CareerProgression(career_id=swe.id, level_title=lvl, experience_range=exp, typical_role=role, salary_range=sal, display_order=idx))

        # Specializations
        swe_specs = [
            ("Distributed Backend & Cloud Systems", "High-throughput microservices, event streaming, and global data stores.", "Very High"),
            ("Machine Learning & AI Platform Engineering", "Deploying, scaling, and serving foundation models and LLM inference pipelines.", "Very High"),
            ("Frontend & Web Platform Engineering", "Complex client state, rendering optimizations, WebAssembly, and responsive design.", "High"),
            ("Site Reliability & DevOps Engineering (SRE)", "Infrastructure as code, cluster orchestration, zero-downtime deployments, and telemetry.", "High"),
        ]
        for idx, (title, desc, demand) in enumerate(swe_specs):
            db.add(CareerSpecialization(career_id=swe.id, title=title, description=desc, market_demand=demand, display_order=idx))

        # Financials
        swe_fin = [
            ("education_cost", "Undergraduate Tuition (Public vs Private)", "$40,000 (In-State Public) - $220,000 (Private University)", "Four-year total cost of attendance including institutional fees."),
            ("additional_costs", "High-Performance Laptop & Development Hardware", "$1,500 - $3,500", "Dedicated workstation capable of local virtualization and compilation."),
            ("funding_options", "Merit & Need-Based STEM Scholarships", "Full to partial tuition coverage", "Offered by government grants, corporate tech diversity foundations, and universities."),
            ("funding_options", "Paid Summer Software Engineering Internships", "$5,000 - $12,000 / month (Top Tech Tier)", "Substantial earnings that frequently offset academic tuition during sophomore/junior years."),
        ]
        for idx, (cat, title, amt, notes) in enumerate(swe_fin):
            db.add(CareerFinancial(career_id=swe.id, category=cat, title=title, amount_or_range=amt, notes=notes, display_order=idx))

        # Practical Considerations
        swe_pc = [
            ("positive", "High compensation ceiling with equity grants (RSUs/stock options)"),
            ("positive", "Extensive geographical mobility and thriving remote/hybrid work landscape"),
            ("positive", "Direct ability to build, iterate, and deliver software used by millions worldwide"),
            ("challenge", "Rapid technology deprecation requiring continuous self-study and upskilling"),
            ("challenge", "Cognitive fatigue from complex debugging and on-call emergency rotations"),
        ]
        for idx, (ptype, text) in enumerate(swe_pc):
            db.add(CareerPracticalConsideration(career_id=swe.id, type=ptype, text=text, display_order=idx))

        # Opportunities
        swe_opps = [
            ("industries", "Enterprise Cloud & SaaS", "Core business applications, developer tooling, security services"),
            ("industries", "Fintech & Quantitative Trading", "High-frequency systems, payment processing, fraud detection"),
            ("industries", "Consumer Internet & Media", "Streaming, social networks, gaming, e-commerce engines"),
            ("work_models", "Remote & Hybrid First", "Extensive flexibility across international timezones"),
            ("geographic_options", "Global Technology Hubs", "Silicon Valley, Seattle, Bengaluru, London, Berlin, Singapore, Tokyo"),
        ]
        for idx, (cat, name, desc) in enumerate(swe_opps):
            db.add(CareerOpportunity(career_id=swe.id, category=cat, name=name, description=desc, display_order=idx))

        # Structured Pathway Graph (React Flow compatible)
        swe_nodes = [
            {"id": "node-1", "position": {"x": 50, "y": 150}, "data": {"title": "Secondary Education (PCM)", "subtitle": "Foundational Math, Physics & Coding Basics", "durationMonths": 24, "estimatedCost": 2000, "nodeType": "education"}},
            {"id": "node-2", "position": {"x": 320, "y": 100}, "data": {"title": "B.S. / B.Tech Computer Science", "subtitle": "Core Algorithms, Networks & Systems", "durationMonths": 48, "estimatedCost": 80000, "nodeType": "education"}},
            {"id": "node-3", "position": {"x": 320, "y": 250}, "data": {"title": "Coding Bootcamp / Self-Taught Portfolio", "subtitle": "Full-Stack projects & open-source contributions", "durationMonths": 12, "estimatedCost": 15000, "nodeType": "certification"}},
            {"id": "node-4", "position": {"x": 620, "y": 170}, "data": {"title": "SWE Internship & Apprenticeship", "subtitle": "Real-world codebase contribution & team rituals", "durationMonths": 6, "estimatedCost": 0, "nodeType": "internship"}},
            {"id": "node-5", "position": {"x": 900, "y": 170}, "data": {"title": "Junior Software Engineer", "subtitle": "Production feature delivery and system monitoring", "durationMonths": 24, "estimatedCost": 0, "nodeType": "entry_role"}},
            {"id": "node-6", "position": {"x": 1180, "y": 170}, "data": {"title": "Senior Engineer / Tech Lead", "subtitle": "System architecture ownership & engineering strategy", "durationMonths": 36, "estimatedCost": 0, "nodeType": "senior_role"}},
        ]
        swe_edges = [
            {"id": "e1-2", "source": "node-1", "target": "node-2", "label": "Formal Degree Route", "animated": True},
            {"id": "e1-3", "source": "node-1", "target": "node-3", "label": "Accelerated Route"},
            {"id": "e2-4", "source": "node-2", "target": "node-4", "animated": True},
            {"id": "e3-4", "source": "node-3", "target": "node-4"},
            {"id": "e4-5", "source": "node-4", "target": "node-5", "animated": True},
            {"id": "e5-6", "source": "node-5", "target": "node-6", "animated": True},
        ]
        swe_pathway = CareerPathway(
            career_id=swe.id,
            title="Software Engineering Career Roadmap",
            description="Complete progression timeline from foundational academic preparation to Senior Tech Lead.",
            total_duration_years=4.5,
            total_estimated_cost="$40,000 - $160,000 [Illustrative Prototype Range]",
            expected_breakeven_years=2.0,
            difficulty_score=7,
            nodes_json=json.dumps(swe_nodes),
            edges_json=json.dumps(swe_edges),
        )
        db.add(swe_pathway)

        # =========================================================================
        # 2. LAWYER — COMPREHENSIVE
        # =========================================================================
        law = Career(
            id="lawyer",
            slug="lawyer",
            title="Lawyer",
            category="Law & Public Policy",
            tagline="Advocate justice, structure complex transactions, and navigate legal systems",
            overview=(
                "Lawyers advise individuals, businesses, and government agencies on legal rights and obligations. "
                "They research statutes, draft contracts and legal briefs, conduct negotiations, and represent clients "
                "in civil, criminal, corporate, and regulatory proceedings."
            ),
            median_pay="$145,000 / yr (US Median) · ₹8,00,000 - ₹25,00,000 / yr (India Corporate / Tier-1 Law Firms) [Illustrative / Prototype data]",
            projected_growth="10% projected growth (2022-2032 · Average growth)",
            work_life_context="Demanding billable-hour environment in top law firms; high prestige; intense trial cycles and deadline-driven deal closings.",
            stress_context="High during active litigation, statutory filing deadlines, corporate M&A transactions, and regulatory inquiries.",
        )
        db.add(law)
        db.flush()

        law_responsibilities = [
            "Advise clients on statutory rights, compliance, dispute resolution, and contractual liabilities",
            "Draft, review, and negotiate complex legal agreements, deeds, settlements, and transactional documents",
            "Conduct exhaustive legal research across case precedents, statutory codes, and judicial rulings",
            "Represent clients in courtroom arguments, mediation sessions, and arbitration tribunals",
            "Manage discovery processes, take witness depositions, and formulate litigation strategies",
            "Ensure adherence to professional ethics codes and regulatory governance frameworks",
        ]
        for idx, r in enumerate(law_responsibilities):
            db.add(CareerResponsibility(career_id=law.id, responsibility=r, display_order=idx))

        law_skills = [
            ("Legal Research & Statutory Interpretation", "technical", 10),
            ("Contract Drafting & Negotiation", "technical", 9),
            ("Case Precedent & Jurisprudential Analysis", "technical", 9),
            ("Litigation & Trial Advocacy", "technical", 8),
            ("Regulatory Compliance & Due Diligence", "technical", 8),
            ("Oral Advocacy & Persuasive Communication", "professional", 10),
            ("Critical & Analytical Reasoning", "professional", 10),
            ("Client Counseling & Empathy", "professional", 8),
            ("High-Stakes Negotiation", "professional", 9),
            ("Ethical Judgment & Professional Discretion", "professional", 9),
        ]
        for idx, (name, stype, score) in enumerate(law_skills):
            db.add(CareerSkill(career_id=law.id, skill_name=name, skill_type=stype, importance_score=score, display_order=idx))

        law_edu = [
            ("after_class_10", "High School / Class 11-12 (Humanities / Commerce / Science)", "Preparation in English, Logic, General Knowledge, and Analytical Reading.", "2 Years", "Standard School Tuition"),
            ("entrance_requirements", "National Law Admissions Test (CLAT / LSAT)", "Competitive examination evaluating legal aptitude, logical reasoning, and comprehension.", "6 - 12 Months prep", "$200 - $500 exam and prep costs"),
            ("after_class_12", "5-Year Integrated Law Degree (B.A. LL.B. / B.B.A. LL.B.)", "Comprehensive legal and liberal arts curriculum covering constitutional, corporate, and civil laws.", "5 Years", "₹6,00,000 - ₹18,00,000 (India) / $60,000 - $200,000 (Abroad)"),
            ("after_class_12", "Post-Graduate Law Route: 3-Year LL.B. / Juris Doctor (J.D.)", "Professional legal curriculum following an undergraduate degree in any discipline.", "3 Years", "$100,000 - $220,000 (US J.D.) / ₹3,00,000 - ₹10,00,000 (India)"),
            ("certifications", "Bar Council Enrollment & Bar Examination (AIBE / State Bar)", "Mandatory licensing credential to practice in courts of law.", "3 - 6 Months", "$300 - $1,500 licensing & exam fees"),
        ]
        for idx, (phase, title, desc, dur, cost) in enumerate(law_edu):
            db.add(CareerEducationPath(career_id=law.id, phase=phase, title=title, description=desc, duration=dur, estimated_cost=cost, display_order=idx))

        law_prog = [
            ("Junior Associate / Judicial Clerk", "0 - 3 Years", "Legal research, document review, case brief drafting, assisting senior counsels", "$65,000 - $110,000 (US) / ₹6L - ₹14L (India)"),
            ("Senior Associate / Managing Attorney", "3 - 6 Years", "Direct client representation, drafting principal agreements, managing deal teams", "$120,000 - $190,000 (US) / ₹15L - ₹28L (India)"),
            ("Partner / Senior Counsel", "6 - 10 Years", "Firm equity partnership, business development, leading major practice groups", "$220,000 - $450,000+ (US) / ₹35L - ₹80L+ (India)"),
            ("Senior Partner / General Counsel (GC)", "10+ Years", "Enterprise-wide legal direction, corporate board advisory, high-stakes advocacy", "$450,000 - $1,000,000+ (US) / ₹1 Cr+ (India)"),
        ]
        for idx, (lvl, exp, role, sal) in enumerate(law_prog):
            db.add(CareerProgression(career_id=law.id, level_title=lvl, experience_range=exp, typical_role=role, salary_range=sal, display_order=idx))

        law_specs = [
            ("Corporate Law & M&A", "Structuring corporate mergers, private equity acquisitions, and regulatory filings.", "High"),
            ("Technology, Privacy & IP Law", "Advising on artificial intelligence, software patents, data protection (GDPR), and trade secrets.", "Very High"),
            ("Criminal & Civil Litigation", "Trial representation in courtroom litigation, appellate courts, and judicial reviews.", "Moderate to High"),
            ("Commercial Arbitration & Dispute Resolution", "Alternative cross-border commercial dispute adjudication and mediation.", "High"),
            ("Constitutional & Public Policy Law", "Human rights advocacy, public interest litigation, and statutory policy advisory.", "Steady"),
        ]
        for idx, (title, desc, dem) in enumerate(law_specs):
            db.add(CareerSpecialization(career_id=law.id, title=title, description=desc, market_demand=dem, display_order=idx))

        law_fin = [
            ("education_cost", "Five-Year Law School / J.D. Tuition", "₹6,00,000 - ₹20,00,000 (India) / $120,000 - $240,000 (US)", "Total cost of professional legal education including university fees."),
            ("additional_costs", "Legal Databases & Professional Subscriptions", "$500 - $2,000 / year", "Access to SCC Online, LexisNexis, Westlaw, and bar library memberships."),
            ("funding_options", "Merit Law Fellowships & Need-Based Aid", "Partial to full tuition remission", "Offered by national law universities, private foundations, and alumni endowments."),
            ("funding_options", "Paid Summer Associateships & Clerkship Stipends", "$10,000 - $35,000 / summer (Top Tier)", "Competitive summer internships providing tuition offsets and pre-placement offers."),
        ]
        for idx, (cat, title, amt, notes) in enumerate(law_fin):
            db.add(CareerFinancial(career_id=law.id, category=cat, title=title, amount_or_range=amt, notes=notes, display_order=idx))

        law_pc = [
            ("positive", "High intellectual prestige, executive advisory influence, and strong long-term earning power"),
            ("positive", "Broad career versatility across private firms, in-house corporate legal teams, judiciary, and public policy"),
            ("positive", "Direct empowerment to defend rights and solve high-stakes societal and commercial conflicts"),
            ("challenge", "High billable-hour pressure (1,800 - 2,200 billable hours/year in top commercial firms)"),
            ("challenge", "Lengthy academic and licensing gestation period before achieving senior partnership or independent practice"),
        ]
        for idx, (ptype, text) in enumerate(law_pc):
            db.add(CareerPracticalConsideration(career_id=law.id, type=ptype, text=text, display_order=idx))

        law_opps = [
            ("industries", "Corporate Law Firms & Boutique Practices", "Mergers, securities, taxation, antitrust, and IP litigation"),
            ("industries", "In-House Enterprise Legal Departments", "Tech companies, financial institutions, healthcare giants, and multinationals"),
            ("industries", "Judiciary & Public Policy Institutions", "Courts, administrative tribunals, law commissions, and think tanks"),
            ("work_models", "Office & Courtroom Centric (Hybrid Emerging)", "In-person client negotiations, court appearances, and confidential document drafting"),
            ("geographic_options", "Major Legal & Financial Capitals", "New Delhi, Mumbai, New York, Washington D.C., London, Singapore, Geneva"),
        ]
        for idx, (cat, name, desc) in enumerate(law_opps):
            db.add(CareerOpportunity(career_id=law.id, category=cat, name=name, description=desc, display_order=idx))


        # =========================================================================
        # 3. DOCTOR (PHYSICIAN / SURGEON) — BASIC
        # =========================================================================
        doc = Career(
            id="medical-doctor",
            slug="medical-doctor",
            title="Physician & Medical Doctor",
            category="Healthcare",
            tagline="Diagnose conditions, heal patients, and advance medical care",
            overview="Physicians examine patients, take medical histories, prescribe medications, and order, perform, and interpret diagnostic tests to manage health and treat diseases.",
            median_pay="$220,000 - $350,000 / yr [Illustrative prototype data]",
            projected_growth="8% projected growth",
            work_life_context="Long shift work, on-call hospital duty, and profound social impact saving lives.",
            stress_context="High during emergency procedures, clinical triage, and critical patient outcomes.",
        )
        db.add(doc)
        db.flush()

        for idx, r in enumerate(["Examine patients and diagnose acute and chronic medical conditions", "Perform medical procedures and oversee clinical care plans", "Collaborate with multidisciplinary healthcare teams"]):
            db.add(CareerResponsibility(career_id=doc.id, responsibility=r, display_order=idx))
        for idx, (name, stype, score) in enumerate([("Clinical Diagnosis & Pathology", "technical", 10), ("Pharmacology & Physiology", "technical", 9), ("Patient Empathy & Bedside Manner", "professional", 10)]):
            db.add(CareerSkill(career_id=doc.id, skill_name=name, skill_type=stype, importance_score=score, display_order=idx))
        for idx, (phase, title, desc, dur, cost) in enumerate([
            ("after_class_12", "Bachelor of Science (Pre-Med / Biology / Chemistry)", "Undergraduate foundational sciences.", "4 Years", "$60,000 - $200,000"),
            ("entrance_requirements", "MCAT / NEET Exam", "Standardized medical admissions exam.", "1 Year prep", "$300 - $600"),
            ("after_class_12", "Medical School (M.D. / D.O. / MBBS)", "Intensive clinical rotations and anatomy.", "4 Years", "$180,000 - $280,000"),
        ]):
            db.add(CareerEducationPath(career_id=doc.id, phase=phase, title=title, description=desc, duration=dur, estimated_cost=cost, display_order=idx))
        for idx, (lvl, exp, role, sal) in enumerate([
            ("Resident Physician", "0-4 Years Post-Grad", "Supervised hospital training", "$65,000 - $80,000"),
            ("Attending Physician", "4+ Years Post-Residency", "Full medical license and independent practice", "$220,000 - $320,000"),
            ("Specialist / Department Chair", "10+ Years", "Surgical specialist or clinical director", "$350,000 - $600,000+"),
        ]):
            db.add(CareerProgression(career_id=doc.id, level_title=lvl, experience_range=exp, typical_role=role, salary_range=sal, display_order=idx))
        for idx, (title, desc, dem) in enumerate([
            ("Internal Medicine", "Diagnosis and nonsurgical treatment of adults.", "High"),
            ("Cardiology & Surgery", "Interventional surgical procedures and cardiovascular care.", "Very High"),
        ]):
            db.add(CareerSpecialization(career_id=doc.id, title=title, description=desc, market_demand=dem, display_order=idx))
        for idx, (cat, title, amt, notes) in enumerate([
            ("education_cost", "Medical School Tuition & Fees", "$200,000 - $320,000", "Total graduate debt profile."),
            ("funding_options", "Public Service Loan Forgiveness (PSLF)", "100% forgiveness after qualifying service", "Available for non-profit hospital service."),
        ]):
            db.add(CareerFinancial(career_id=doc.id, category=cat, title=title, amount_or_range=amt, notes=notes, display_order=idx))
        for idx, (ptype, text) in enumerate([
            ("positive", "Unmatched personal fulfillment and profound social contribution"),
            ("challenge", "Extensive educational timeline (11-15 years including residency)"),
        ]):
            db.add(CareerPracticalConsideration(career_id=doc.id, type=ptype, text=text, display_order=idx))
        for idx, (cat, name, desc) in enumerate([
            ("industries", "Hospitals & Health Networks", "Inpatient and acute emergency care"),
            ("work_models", "On-Site Clinical Hospital Shifts", "Hands-on patient care"),
        ]):
            db.add(CareerOpportunity(career_id=doc.id, category=cat, name=name, description=desc, display_order=idx))

        # =========================================================================
        # 4. DATA SCIENTIST — BASIC
        # =========================================================================
        ds = Career(
            id="data-scientist",
            slug="data-scientist",
            title="Data Scientist",
            category="Technology",
            tagline="Uncover patterns in massive datasets and build predictive intelligence",
            overview="Data Scientists extract insights and predictive intelligence from structured and unstructured data using statistical modeling, machine learning, and domain expertise.",
            median_pay="$128,000 / yr [Illustrative prototype data]",
            projected_growth="35% projected growth (Much faster than average)",
            work_life_context="Collaborative analytical role with widespread remote and hybrid work opportunities.",
            stress_context="Moderate, tied to model performance, data hygiene quality, and business decision deadlines.",
        )
        db.add(ds)
        db.flush()

        for idx, r in enumerate(["Develop statistical and machine learning predictive models", "Clean and transform complex messy data pipelines", "Present data-driven strategic insights to executives"]):
            db.add(CareerResponsibility(career_id=ds.id, responsibility=r, display_order=idx))
        for idx, (name, stype, score) in enumerate([("Machine Learning & Python", "technical", 10), ("Statistical Modeling & Probability", "technical", 9), ("Data Storytelling & Visualization", "professional", 8)]):
            db.add(CareerSkill(career_id=ds.id, skill_name=name, skill_type=stype, importance_score=score, display_order=idx))
        for idx, (phase, title, desc, dur, cost) in enumerate([
            ("after_class_12", "B.S. in Computer Science / Statistics / Mathematics", "Rigorous mathematical foundation.", "4 Years", "$40,000 - $160,000"),
            ("certifications", "Applied Machine Learning Specialist", "Hands-on portfolio and model training.", "6 Months", "$500 - $2,000"),
        ]):
            db.add(CareerEducationPath(career_id=ds.id, phase=phase, title=title, description=desc, duration=dur, estimated_cost=cost, display_order=idx))
        for idx, (lvl, exp, role, sal) in enumerate([
            ("Junior Data Analyst / Scientist", "0-2 Years", "Data wrangling, dashboarding, exploratory analysis", "$80,000 - $105,000"),
            ("Data Scientist", "2-5 Years", "Production ML pipelines and experimental design", "$110,000 - $145,000"),
            ("Lead Data Scientist", "5+ Years", "Algorithm research leadership and product AI strategy", "$150,000 - $220,000+"),
        ]):
            db.add(CareerProgression(career_id=ds.id, level_title=lvl, experience_range=exp, typical_role=role, salary_range=sal, display_order=idx))
        for idx, (title, desc, dem) in enumerate([
            ("Natural Language Processing (NLP)", "Large language models and conversational intelligence.", "Very High"),
            ("Computer Vision", "Visual inspection, medical imaging, and autonomous perception.", "High"),
        ]):
            db.add(CareerSpecialization(career_id=ds.id, title=title, description=desc, market_demand=dem, display_order=idx))
        for idx, (cat, title, amt, notes) in enumerate([
            ("education_cost", "Undergraduate Degree Cost", "$40,000 - $160,000", "Total tuition investment."),
            ("funding_options", "Graduate Assistantships & Fellowships", "Tuition waiver + monthly stipend", "Available for M.S./Ph.D. candidates."),
        ]):
            db.add(CareerFinancial(career_id=ds.id, category=cat, title=title, amount_or_range=amt, notes=notes, display_order=idx))
        for idx, (ptype, text) in enumerate([
            ("positive", "Massive market demand across every industrial sector"),
            ("challenge", "Significant data cleaning and pipeline maintenance overhead"),
        ]):
            db.add(CareerPracticalConsideration(career_id=ds.id, type=ptype, text=text, display_order=idx))
        for idx, (cat, name, desc) in enumerate([
            ("industries", "Technology & E-Commerce", "Recommendation engines and ad-tech"),
            ("work_models", "High Remote / Hybrid Flexibility", "Autonomous compute workflows"),
        ]):
            db.add(CareerOpportunity(career_id=ds.id, category=cat, name=name, description=desc, display_order=idx))

        # =========================================================================
        # 5. CHARTERED ACCOUNTANT (CA / CPA) — BASIC
        # =========================================================================
        ca = Career(
            id="chartered-accountant",
            slug="chartered-accountant",
            title="Chartered Accountant & CPA",
            category="Business & Finance",
            tagline="Ensure fiscal integrity, optimize taxation, and steer enterprise finance",
            overview="Chartered Accountants and CPAs provide financial audit, tax advisory, forensic analysis, and strategic financial planning to corporations and individuals.",
            median_pay="$95,000 - $140,000 / yr [Illustrative prototype data]",
            projected_growth="7% projected growth (Stable demand)",
            work_life_context="Structured corporate workflow with seasonal spikes during tax and annual audit quarters.",
            stress_context="High during statutory tax deadlines and regulatory audit closures.",
        )
        db.add(ca)
        db.flush()

        for idx, r in enumerate(["Conduct independent financial audits of corporate balance sheets", "Develop strategic corporate tax optimization structures", "Advise CFOs on capital allocation and compliance"]):
            db.add(CareerResponsibility(career_id=ca.id, responsibility=r, display_order=idx))
        for idx, (name, stype, score) in enumerate([("Financial Accounting & GAAP/IFRS", "technical", 10), ("Tax Regulation & Compliance", "technical", 9), ("Ethical Rigor & Skepticism", "professional", 10)]):
            db.add(CareerSkill(career_id=ca.id, skill_name=name, skill_type=stype, importance_score=score, display_order=idx))
        for idx, (phase, title, desc, dur, cost) in enumerate([
            ("after_class_12", "Bachelor of Commerce / Accounting (120-150 Credits)", "Undergraduate accounting foundation.", "3 - 4 Years", "$30,000 - $120,000"),
            ("certifications", "CPA / CA Professional Examination & Articleship", "Rigorous multi-part professional certification.", "2 - 3 Years", "$3,000 - $8,000"),
        ]):
            db.add(CareerEducationPath(career_id=ca.id, phase=phase, title=title, description=desc, duration=dur, estimated_cost=cost, display_order=idx))
        for idx, (lvl, exp, role, sal) in enumerate([
            ("Audit Associate", "0-3 Years", "Field audit verification and testing", "$65,000 - $85,000"),
            ("Senior Accountant / Manager", "3-6 Years", "Audit team leadership and tax strategy", "$95,000 - $135,000"),
            ("Partner / Finance Director", "7+ Years", "Firm partnership or VP Finance", "$180,000 - $300,000+"),
        ]):
            db.add(CareerProgression(career_id=ca.id, level_title=lvl, experience_range=exp, typical_role=role, salary_range=sal, display_order=idx))
        for idx, (title, desc, dem) in enumerate([
            ("Forensic Accounting", "Investigating financial fraud and embezzlement.", "High"),
            ("International Corporate Taxation", "Cross-border tax planning and treaties.", "High"),
        ]):
            db.add(CareerSpecialization(career_id=ca.id, title=title, description=desc, market_demand=dem, display_order=idx))
        for idx, (cat, title, amt, notes) in enumerate([
            ("education_cost", "Degree and Exam Fees", "$35,000 - $130,000", "Total preparation cost."),
            ("funding_options", "Employer Tuition Sponsorship", "100% CPA exam fee reimbursement", "Standard benefit at major audit firms."),
        ]):
            db.add(CareerFinancial(career_id=ca.id, category=cat, title=title, amount_or_range=amt, notes=notes, display_order=idx))
        for idx, (ptype, text) in enumerate([
            ("positive", "Recession-resilient profession with globally respected credentials"),
            ("challenge", "Extremely demanding busy season (Jan-April) with 65+ hour weeks"),
        ]):
            db.add(CareerPracticalConsideration(career_id=ca.id, type=ptype, text=text, display_order=idx))
        for idx, (cat, name, desc) in enumerate([
            ("industries", "Big Four & Public Accounting", "PwC, Deloitte, EY, KPMG"),
            ("work_models", "Hybrid Corporate Office", "Client sites and office based"),
        ]):
            db.add(CareerOpportunity(career_id=ca.id, category=cat, name=name, description=desc, display_order=idx))

        # =========================================================================
        # 6. UX DESIGNER — BASIC
        # =========================================================================
        ux = Career(
            id="ux-designer",
            slug="ux-designer",
            title="Product & UX Designer",
            category="Creative Arts & Design",
            tagline="Craft intuitive, delightful, and human-centered digital experiences",
            overview="UX Designers research user behaviors, define information architecture, and create wireframes and interactive prototypes for web and mobile software.",
            median_pay="$105,000 / yr [Illustrative prototype data]",
            projected_growth="16% projected growth",
            work_life_context="Highly collaborative cross-functional design sprints with high remote flexibility.",
            stress_context="Moderate, focused on user test validation and design system alignment.",
        )
        db.add(ux)
        db.flush()

        for idx, r in enumerate(["Conduct user empathy interviews and usability testing", "Build interactive wireframes, component libraries, and prototypes in Figma", "Collaborate with engineers to ensure pixel-perfect implementation"]):
            db.add(CareerResponsibility(career_id=ux.id, responsibility=r, display_order=idx))
        for idx, (name, stype, score) in enumerate([("UI/UX Prototyping & Figma", "technical", 10), ("User Research & Usability Testing", "technical", 9), ("Empathy & Storytelling", "professional", 9)]):
            db.add(CareerSkill(career_id=ux.id, skill_name=name, skill_type=stype, importance_score=score, display_order=idx))
        for idx, (phase, title, desc, dur, cost) in enumerate([
            ("after_class_12", "B.Des / B.S. in Interaction Design or HCI", "Foundations of visual design and cognitive ergonomics.", "4 Years", "$40,000 - $160,000"),
            ("certifications", "UX Design Portfolio Bootcamp", "Practical case studies and portfolio development.", "6 Months", "$10,000 - $16,000"),
        ]):
            db.add(CareerEducationPath(career_id=ux.id, phase=phase, title=title, description=desc, duration=dur, estimated_cost=cost, display_order=idx))
        for idx, (lvl, exp, role, sal) in enumerate([
            ("Junior UX Designer", "0-2 Years", "UI components, user flows, and wireframing", "$70,000 - $90,000"),
            ("Product Designer", "2-5 Years", "End-to-end feature design ownership", "$100,000 - $135,000"),
            ("Lead / Staff Product Designer", "5+ Years", "Design systems leadership and product vision", "$145,000 - $200,000+"),
        ]):
            db.add(CareerProgression(career_id=ux.id, level_title=lvl, experience_range=exp, typical_role=role, salary_range=sal, display_order=idx))
        for idx, (title, desc, dem) in enumerate([
            ("Design Systems Engineering", "Scalable multi-platform component systems.", "High"),
            ("Voice & AI Interaction Design", "Designing conversational and multimodal user flows.", "Very High"),
        ]):
            db.add(CareerSpecialization(career_id=ux.id, title=title, description=desc, market_demand=dem, display_order=idx))
        for idx, (cat, title, amt, notes) in enumerate([
            ("education_cost", "Design School / Degree Cost", "$40,000 - $160,000", "Tuition and design software licenses."),
            ("funding_options", "Design Competition Scholarships", "$5,000 - $20,000", "Awarded based on student portfolio excellence."),
        ]):
            db.add(CareerFinancial(career_id=ux.id, category=cat, title=title, amount_or_range=amt, notes=notes, display_order=idx))
        for idx, (ptype, text) in enumerate([
            ("positive", "Direct visual creativity combined with scientific human psychology"),
            ("challenge", "Balancing business KPIs with idealistic user experience desires"),
        ]):
            db.add(CareerPracticalConsideration(career_id=ux.id, type=ptype, text=text, display_order=idx))
        for idx, (cat, name, desc) in enumerate([
            ("industries", "Consumer Tech & Mobile Apps", "Fintech, Edtech, E-commerce"),
            ("work_models", "Remote & Hybrid First", "Digital design tooling (Figma/Miro)"),
        ]):
            db.add(CareerOpportunity(career_id=ux.id, category=cat, name=name, description=desc, display_order=idx))

        # =========================================================================
        # 7. CIVIL ENGINEER — BASIC
        # =========================================================================
        civil = Career(
            id="civil-engineer",
            slug="civil-engineer",
            title="Civil & Structural Engineer",
            category="Engineering",
            tagline="Design and build critical infrastructure, transportation networks, and sustainable cities",
            overview="Civil Engineers conceive, design, build, supervise, operate, construct, and maintain infrastructure projects in the public and private sectors.",
            median_pay="$90,000 - $125,000 / yr [Illustrative prototype data]",
            projected_growth="5% projected growth (Essential infrastructure modernization)",
            work_life_context="Mix of engineering design offices and on-site physical construction inspection.",
            stress_context="High regarding public safety compliance, structural tolerances, and weather delays.",
        )
        db.add(civil)
        db.flush()

        for idx, r in enumerate(["Calculate structural load capacities and material stress tolerances", "Review blueprints, environmental impact assessments, and zoning laws", "Direct on-site construction contractors and ensure quality standards"]):
            db.add(CareerResponsibility(career_id=civil.id, responsibility=r, display_order=idx))
        for idx, (name, stype, score) in enumerate([("Structural Analysis & CAD/BIM", "technical", 10), ("Geotechnical & Fluid Mechanics", "technical", 9), ("Project Management & Safety Standards", "professional", 9)]):
            db.add(CareerSkill(career_id=civil.id, skill_name=name, skill_type=stype, importance_score=score, display_order=idx))
        for idx, (phase, title, desc, dur, cost) in enumerate([
            ("after_class_12", "B.Tech / B.S. in Civil Engineering", "Core structural, geotechnical, and environmental engineering.", "4 Years", "$40,000 - $150,000"),
            ("certifications", "FE Exam & Professional Engineer (PE) License", "Mandatory statutory credential for signing blueprints.", "4 Years experience", "$500 - $1,000"),
        ]):
            db.add(CareerEducationPath(career_id=civil.id, phase=phase, title=title, description=desc, duration=dur, estimated_cost=cost, display_order=idx))
        for idx, (lvl, exp, role, sal) in enumerate([
            ("Graduate Civil Engineer (EIT)", "0-2 Years", "Drafting, load calculations, field surveying", "$65,000 - $80,000"),
            ("Project Engineer (PE)", "3-6 Years", "Project design lead and permit approval", "$85,000 - $115,000"),
            ("Principal / Chief Structural Engineer", "7+ Years", "Mega-infrastructure project oversight", "$130,000 - $185,000+"),
        ]):
            db.add(CareerProgression(career_id=civil.id, level_title=lvl, experience_range=exp, typical_role=role, salary_range=sal, display_order=idx))
        for idx, (title, desc, dem) in enumerate([
            ("Renewable & Resilient Infrastructure", "Designing flood defenses and green energy structures.", "High"),
            ("Transportation Networks", "High-speed rail, bridges, and airport transit hubs.", "High"),
        ]):
            db.add(CareerSpecialization(career_id=civil.id, title=title, description=desc, market_demand=dem, display_order=idx))
        for idx, (cat, title, amt, notes) in enumerate([
            ("education_cost", "ABET Accredited Degree", "$40,000 - $150,000", "Four-year engineering degree cost."),
            ("funding_options", "Federal Infrastructure & ASCE Grants", "$5,000 - $15,000", "Grants promoting civil engineering education."),
        ]):
            db.add(CareerFinancial(career_id=civil.id, category=cat, title=title, amount_or_range=amt, notes=notes, display_order=idx))
        for idx, (ptype, text) in enumerate([
            ("positive", "Tangible, lasting physical legacy visible in real-world skylines"),
            ("challenge", "Strict legal liability for structural safety and public wellbeing"),
        ]):
            db.add(CareerPracticalConsideration(career_id=civil.id, type=ptype, text=text, display_order=idx))
        for idx, (cat, name, desc) in enumerate([
            ("industries", "Infrastructure & Municipalities", "Government DOT, public works, private construction"),
            ("work_models", "Hybrid Office & Construction Field Sites", "Physical inspection required"),
        ]):
            db.add(CareerOpportunity(career_id=civil.id, category=cat, name=name, description=desc, display_order=idx))

        # =========================================================================
        # 8. ENTREPRENEUR (TECH FOUNDER) — BASIC
        # =========================================================================
        founder = Career(
            id="tech-founder",
            slug="tech-founder",
            title="Tech Founder & Entrepreneur",
            category="Business & Innovation",
            tagline="Build a high-growth venture from ground zero into a market leader",
            overview="Entrepreneurs discover market inefficiencies, assemble world-class teams, raise venture capital, and build disruptive technology products to create new industries.",
            median_pay="$45,000 (Early-stage bootstrap) to $250,000+ (Post-Series A) [Illustrative prototype data]",
            projected_growth="Varies significantly by macroeconomic cycles",
            work_life_context="High autonomy and 24/7 personal ownership of company survival and team culture.",
            stress_context="Extreme during runway constraints, fundraising pitches, and product-market fit search.",
        )
        db.add(founder)
        db.flush()

        for idx, r in enumerate(["Identify customer pain points and formulate product value propositions", "Recruit founding engineers, designers, and sales leaders", "Pitch venture capital firms and manage company runway"]):
            db.add(CareerResponsibility(career_id=founder.id, responsibility=r, display_order=idx))
        for idx, (name, stype, score) in enumerate([("Product-Market Fit Discovery", "technical", 10), ("Capital Allocation & Unit Economics", "technical", 9), ("Resilience & Visionary Leadership", "professional", 10)]):
            db.add(CareerSkill(career_id=founder.id, skill_name=name, skill_type=stype, importance_score=score, display_order=idx))
        for idx, (phase, title, desc, dur, cost) in enumerate([
            ("after_class_12", "Bachelor's in Engineering, CS, or Business", "Analytical foundation and student network.", "4 Years", "$40,000 - $180,000"),
            ("certifications", "Startup Accelerator (e.g. Y Combinator / Techstars)", "Intensive 3-month cohort on growth and fundraising.", "3 Months", "$0 upfront (equity based)"),
        ]):
            db.add(CareerEducationPath(career_id=founder.id, phase=phase, title=title, description=desc, duration=dur, estimated_cost=cost, display_order=idx))
        for idx, (lvl, exp, role, sal) in enumerate([
            ("Pre-Seed / Bootstrapped Founder", "Year 0-2", "Building MVP and securing first 100 customers", "$0 - $60,000"),
            ("Seed / Series A CEO", "Year 2-5", "Hiring executive team, scaling sales funnel", "$120,000 - $180,000"),
            ("Growth-Stage / Scaled Enterprise CEO", "Year 5+", "Global expansion and capital markets / IPO", "$250,000+ & Equity"),
        ]):
            db.add(CareerProgression(career_id=founder.id, level_title=lvl, experience_range=exp, typical_role=role, salary_range=sal, display_order=idx))
        for idx, (title, desc, dem) in enumerate([
            ("B2B Enterprise SaaS", "Recurring revenue software for enterprise productivity.", "High"),
            ("DeepTech & AI Ventures", "Commercializing proprietary algorithmic breakthroughs.", "Very High"),
        ]):
            db.add(CareerSpecialization(career_id=founder.id, title=title, description=desc, market_demand=dem, display_order=idx))
        for idx, (cat, title, amt, notes) in enumerate([
            ("education_cost", "Academic & Prototyping Cost", "$40,000 - $180,000", "Education and initial testing capital."),
            ("funding_options", "Angel & Venture Capital Seed Investment", "$250,000 - $2,000,000+", "Equity investment for early growth."),
        ]):
            db.add(CareerFinancial(career_id=founder.id, category=cat, title=title, amount_or_range=amt, notes=notes, display_order=idx))
        for idx, (ptype, text) in enumerate([
            ("positive", "Unlimited equity upside and total autonomy building meaningful solutions"),
            ("challenge", "High failure rate (~90% of early-stage startups fail to achieve liquidity)"),
        ]):
            db.add(CareerPracticalConsideration(career_id=founder.id, type=ptype, text=text, display_order=idx))
        for idx, (cat, name, desc) in enumerate([
            ("industries", "Venture-Backed Technology", "AI, Cloud, BioTech, CleanTech"),
            ("work_models", "High Autonomy / In-Person Founding Hub", "Incubators, co-working, customer sites"),
        ]):
            db.add(CareerOpportunity(career_id=founder.id, category=cat, name=name, description=desc, display_order=idx))

        db.commit()
        print("Successfully seeded 8 structured careers into CareerQuest database!")

        # Seed Experience Lab Simulation
        seed_experiences(db)

        # Seed What-If Pathway Options
        seed_what_if_pathways(db)

        # Seed Funding Options
        seed_funding_options(db)

        return 8


    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        if owns_session:
            db.close()


if __name__ == "__main__":
    seed_database()
