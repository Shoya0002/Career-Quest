from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.career import Career
from app.models.experience import (
    Experience,
    Scenario,
    Evidence,
    Decision,
    DecisionOutcome,
    ExperienceSkill,
    Reflection,
)


def seed_experiences(db: Session = None):
    """
    Seed the database with the complete Software Engineer Production Incident Experience simulation.
    """
    owns_session = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        owns_session = True

    try:
        swe_career = db.query(Career).filter(Career.id == "software-engineer").first()
        if not swe_career:
            print("Software engineer career not found. Please seed careers first.")
            return

        # Check if experience already exists
        existing_exp = db.query(Experience).filter(Experience.slug == "production-incident").first()
        if existing_exp:
            print("Production Incident experience already exists. Re-seeding experience simulation...")
            db.delete(existing_exp)
            db.commit()

        # =========================================================================
        # 1. EXPERIENCE MASTER RECORD
        # =========================================================================
        exp = Experience(
            id="exp-swe-incident",
            career_id=swe_career.id,
            slug="production-incident",
            title="Production Incident: The Payment API Latency Spike",
            description=(
                "A high-severity monitoring alert fires 20 minutes after a new code release. "
                "Step into the shoes of an on-call Software Engineer, triage live telemetry, "
                "determine the root cause, execute mitigation under pressure, and lead cross-functional communication."
            ),
            role="Software Engineer",
            estimated_duration="15-20 Mins",
            difficulty="Intermediate",
            learning_objective="Practice real-world incident triage, metric correlation, rollback risk assessment, and transparent technical communication under production time constraints.",
        )
        db.add(exp)
        db.flush()

        # Experience Skills
        skills = [
            "Incident Response",
            "Debugging & Telemetry",
            "System Thinking",
            "Prioritization",
            "Decision Making Under Ambiguity",
            "Cross-Functional Communication",
        ]
        for s in skills:
            db.add(ExperienceSkill(experience_id=exp.id, skill_name=s))

        # Reflection Prompts
        reflections = [
            (
                "When the PagerDuty alert fired, did you rely on system metrics (DB CPU vs API latency) to form a hypothesis, or did you feel an impulse to guess the root cause?",
                "Strategy",
                0,
            ),
            (
                "How did the tension between executing an immediate 90-second rollback versus writing a live code hotfix influence your calculation of operational risk?",
                "Cognitive Load",
                1,
            ),
            (
                "Did you find diagnosing production telemetry and coordinating incident response under time constraints intellectually energizing, or did it feel stressful?",
                "Self-Awareness",
                2,
            ),
        ]
        for prompt, category, order in reflections:
            db.add(Reflection(experience_id=exp.id, prompt=prompt, category=category, display_order=order))

        # =========================================================================
        # 2. SCENARIO 1: The Production Alert
        # =========================================================================
        sc1 = Scenario(
            id="sc-swe-01",
            experience_id=exp.id,
            sequence=1,
            title="The Production Alert",
            situation="At 14:22 UTC, PagerDuty triggers a high-severity alert: The core Checkout & Payments API error rate jumped from 0.1% to 38.4%, impacting customer transactions.",
            description="You log into the observability dashboard. You have limited time before executive escalation. Analyze the immediate telemetry evidence and decide on your initial triage step.",
        )
        db.add(sc1)
        db.flush()

        # Scenario 1 Evidence
        sc1_evidence = [
            ("Deployment Timeline", "timeline", "Release v2.4.1 (payment gateway retry optimization) was deployed to production 22 minutes ago by the backend platform team.", "critical", 0),
            ("API Error Rate Metric", "metric", "HTTP 504 Gateway Timeout and 500 Internal Server Errors surged on `/api/v1/payments/charge` starting exactly 3 minutes post-deploy.", "critical", 1),
            ("Database Telemetry", "metric", "Primary PostgreSQL cluster CPU load is 18%, connection pool is at 24/200, and query latencies for standard reads remain under 5ms.", "high", 2),
            ("Service Latency Graph", "metric", "Payment API p99 latency spiked from 140ms to 8,200ms, while downstream catalog and inventory services report normal 45ms response times.", "high", 3),
            ("Slack #incident-war-room", "chat", "Engineering VP: 'Payment checkouts are dropping in the EU region. Who is on triage?'", "medium", 4),
        ]
        for title, etype, content, imp, order in sc1_evidence:
            db.add(Evidence(scenario_id=sc1.id, title=title, type=etype, content=content, importance=imp, display_order=order))

        # =========================================================================
        # 3. SCENARIO 2: Isolating Root Cause & Mitigation
        # =========================================================================
        sc2 = Scenario(
            id="sc-swe-02",
            experience_id=exp.id,
            sequence=2,
            title="Isolating Root Cause & Immediate Mitigation",
            situation="Your investigation confirms that v2.4.1 included an un-throttled synchronous retry loop against the external payment gateway, causing thread pool exhaustion under load.",
            description="The payment gateway is rate-limiting the service and customer carts are failing. You must decide on the mitigation strategy to restore customer checkout flow.",
        )
        db.add(sc2)
        db.flush()

        # Scenario 2 Evidence
        sc2_evidence = [
            ("Git Pull Request #1402 Diff", "log", "Merged commit b38a19: replaced async queuing with synchronous 5-attempt retry loop without jitter on HTTP 429.", "critical", 0),
            ("Gateway Response Headers", "log", "`X-RateLimit-Remaining: 0`, `Retry-After: 60s` returned by Stripe/Adyen gateway endpoints.", "high", 1),
            ("Rollback Safety Verification", "status", "Release v2.4.1 included zero database schema migrations; v2.4.0 is tagged and verified in the CI/CD pipeline.", "critical", 2),
            ("Live Traffic Volume", "metric", "Incoming checkout requests: 450 requests/sec across all regions.", "medium", 3),
        ]
        for title, etype, content, imp, order in sc2_evidence:
            db.add(Evidence(scenario_id=sc2.id, title=title, type=etype, content=content, importance=imp, display_order=order))

        # =========================================================================
        # 4. SCENARIO 3: Cross-Functional Incident Communication
        # =========================================================================
        sc3 = Scenario(
            id="sc-swe-03",
            experience_id=exp.id,
            sequence=3,
            title="Cross-Functional Incident Communication & Post-Mortem",
            situation="Traffic and error rates have stabilized back to normal baseline (0.04% error rate). The immediate outage is contained.",
            description="The Product Lead, Customer Support Director, and Engineering Leadership are awaiting an official incident update and next steps before closing the incident war room.",
        )
        db.add(sc3)
        db.flush()

        # Scenario 3 Evidence
        sc3_evidence = [
            ("Current Service Health Telemetry", "metric", "Checkout latency: 125ms (Normal). Error rate: 0.04% (Normal). Gateway responses: 200 OK.", "high", 0),
            ("Support Queue Backlog", "status", "142 pending customer tickets inquiring about duplicate charges or failed checkout buttons.", "high", 1),
            ("Public Status Page", "status", "Current status: 'Investigating degraded payment performance' (Needs update).", "medium", 2),
            ("Post-Mortem Policy Doc", "log", "Internal engineering standard: Blameless post-mortem required within 48 hours for all Tier-1 outages.", "medium", 3),
        ]
        for title, etype, content, imp, order in sc3_evidence:
            db.add(Evidence(scenario_id=sc3.id, title=title, type=etype, content=content, importance=imp, display_order=order))

        # =========================================================================
        # 5. DECISIONS & OUTCOMES: Scenario 1
        # =========================================================================
        # Decision 1A (Recommended)
        d1a = Decision(
            id="dec-swe-1a",
            scenario_id=sc1.id,
            title="Investigate the latest v2.4.1 deployment commits and release diffs.",
            description="Correlate the 22-minute-old deployment with the API latency spike before touching infrastructure.",
            sequence=1,
        )
        db.add(d1a)
        db.flush()
        db.add(DecisionOutcome(
            decision_id=d1a.id,
            title="Telemetry pinpointed to newly introduced connection timeout loop in v2.4.1",
            description="Inspection of commit logs revealed that PR #1402 introduced a synchronous retry loop without exponential backoff, exhausting thread pools.",
            consequence="You isolated the root cause to the recent software release in under 4 minutes without disrupting healthy backend infrastructure.",
            feedback="Excellent investigative prioritization. When an incident occurs shortly after a deployment and database health metrics are normal, checking the release diff is the most direct diagnostic pathway.",
            score_delta=25,
            technical_score=9,
            reasoning_score=9,
            prioritization_score=9,
            communication_score=7,
            next_scenario_id=sc2.id,
        ))

        # Decision 1B
        d1b = Decision(
            id="dec-swe-1b",
            scenario_id=sc1.id,
            title="Restart the primary database cluster immediately to clear active connections.",
            description="Assume connection exhaustion and force a restart of the database cluster.",
            sequence=2,
        )
        db.add(d1b)
        db.flush()
        db.add(DecisionOutcome(
            decision_id=d1b.id,
            title="Database reboot caused secondary system-wide outage",
            description="Restarting the database dropped all active user sessions across the entire platform while leaving the payment gateway timeout completely unresolved.",
            consequence="System downtime increased by an additional 6 minutes while the database recovered its write-ahead logs.",
            feedback="Weak decision. The database telemetry explicitly showed normal CPU (18%) and low connection utilization (24/200). Restarting healthy core infrastructure adds needless blast radius to an isolated API issue.",
            score_delta=5,
            technical_score=2,
            reasoning_score=3,
            prioritization_score=4,
            communication_score=4,
            next_scenario_id=sc2.id,
        ))

        # Decision 1C
        d1c = Decision(
            id="dec-swe-1c",
            scenario_id=sc1.id,
            title="Wait 15 minutes to observe whether transient network spikes clear on their own.",
            description="Assume external internet routing issues and hold off on active intervention.",
            sequence=3,
        )
        db.add(d1c)
        db.flush()
        db.add(DecisionOutcome(
            decision_id=d1c.id,
            title="Failure rate escalated, causing $85,000 in failed transactions",
            description="Inaction allowed hundreds of cart abandonments and prompted customer complaints on social media.",
            consequence="The incident escalated to executive management due to lack of active triage.",
            feedback="Poor incident management. A 38% error spike on a critical revenue pathway requires active hypothesis testing and intervention rather than passive observation.",
            score_delta=0,
            technical_score=1,
            reasoning_score=2,
            prioritization_score=1,
            communication_score=2,
            next_scenario_id=sc2.id,
        ))

        # =========================================================================
        # 6. DECISIONS & OUTCOMES: Scenario 2
        # =========================================================================
        # Decision 2A (Recommended)
        d2a = Decision(
            id="dec-swe-2a",
            scenario_id=sc2.id,
            title="Execute an immediate automated rollback to stable release v2.4.0.",
            description="Trigger the CI/CD pipeline rollback to restore known good code without downtime.",
            sequence=1,
        )
        db.add(d2a)
        db.flush()
        db.add(DecisionOutcome(
            decision_id=d2a.id,
            title="Rollback completed cleanly in 90 seconds; error rate dropped to 0.04%",
            description="The deployment pipeline safely restored v2.4.0. Thread pool saturation vanished and payment gateway calls normalized.",
            consequence="Customer transactions resumed with 99.96% success rate, preserving company revenue while giving engineers time to fix the code properly.",
            feedback="Optimal engineering response. In production incidents, restoring customer service via a zero-risk rollback takes precedence over writing quick, untested hotfixes under fire.",
            score_delta=25,
            technical_score=9,
            reasoning_score=9,
            prioritization_score=10,
            communication_score=8,
            next_scenario_id=sc3.id,
        ))

        # Decision 2B
        d2b = Decision(
            id="dec-swe-2b",
            scenario_id=sc2.id,
            title="Attempt to write and push an emergency hotfix directly to production main.",
            description="Quickly edit the retry loop logic in a hotfix branch and push through the build pipeline.",
            sequence=2,
        )
        db.add(d2b)
        db.flush()
        db.add(DecisionOutcome(
            decision_id=d2b.id,
            title="Hotfix build pipeline took 22 minutes to compile and test",
            description="Customers experienced an extended 22-minute checkout outage while engineers raced to write, review, and test syntax under pressure.",
            consequence="The hotfix worked eventually, but cost the business 15 times more downtime than a 90-second rollback.",
            feedback="Suboptimal choice. While well-intentioned, hotfixing during active downtime introduces fresh syntax risks and prolongs downtime compared to a verified instant rollback.",
            score_delta=10,
            technical_score=6,
            reasoning_score=5,
            prioritization_score=4,
            communication_score=5,
            next_scenario_id=sc3.id,
        ))

        # Decision 2C
        d2c = Decision(
            id="dec-swe-2c",
            scenario_id=sc2.id,
            title="Deploy a secondary feature flag toggle to disable payments completely until tomorrow.",
            description="Shut down payment processing entirely to stop error alerts from firing.",
            sequence=3,
        )
        db.add(d2c)
        db.flush()
        db.add(DecisionOutcome(
            decision_id=d2c.id,
            title="Entire platform revenue halted for 18 hours",
            description="Disabling payments stopped the error alerts, but completely halted company sales.",
            consequence="Over $400,000 in revenue was lost because payments were turned off instead of rolling back the code.",
            feedback="Disproportionate mitigation. Turning off core revenue functionality when a clean rollback was available represents flawed prioritization.",
            score_delta=5,
            technical_score=3,
            reasoning_score=3,
            prioritization_score=2,
            communication_score=4,
            next_scenario_id=sc3.id,
        ))

        # =========================================================================
        # 7. DECISIONS & OUTCOMES: Scenario 3
        # =========================================================================
        # Decision 3A (Recommended)
        d3a = Decision(
            id="dec-swe-3a",
            scenario_id=sc3.id,
            title="Post a transparent incident resolution update to Support & Status Page, provide a clear summary to leadership, and schedule a blameless post-mortem.",
            description="Close the communication loop across all stakeholders and establish preventative process fixes.",
            sequence=1,
        )
        db.add(d3a)
        db.flush()
        db.add(DecisionOutcome(
            decision_id=d3a.id,
            title="Cross-functional alignment achieved and customer trust preserved",
            description="Customer Support received exact outage timestamps to assist impacted users, the public status page turned green, and the engineering team scheduled a post-mortem to build automated rate-limit integration tests.",
            consequence="The incident was closed with zero recurring fallout and reinforced high organizational trust.",
            feedback="Exemplary professional engineering leadership. High-caliber software engineering combines technical mitigation with transparent communication, cross-team empathy, and blameless continuous learning.",
            score_delta=25,
            technical_score=8,
            reasoning_score=9,
            prioritization_score=9,
            communication_score=10,
            next_scenario_id=None,  # Final completion!
        ))

        # Decision 3B
        d3b = Decision(
            id="dec-swe-3b",
            scenario_id=sc3.id,
            title="Silently close the war room channel without posting an update since the system is working now.",
            description="Assume that because errors stopped, other departments will figure out the issue is resolved.",
            sequence=2,
        )
        db.add(d3b)
        db.flush()
        db.add(DecisionOutcome(
            decision_id=d3b.id,
            title="Support and executive leadership were left in the dark",
            description="Customer support spent 3 extra hours manually replying to users with obsolete information and leadership escalated why no status update was filed.",
            consequence="Created confusion and friction between engineering and customer-facing teams.",
            feedback="Weak communication. Fixing the code without updating customer-facing teammates damages organizational trust.",
            score_delta=5,
            technical_score=6,
            reasoning_score=4,
            prioritization_score=4,
            communication_score=1,
            next_scenario_id=None,
        ))

        # Decision 3C
        d3c = Decision(
            id="dec-swe-3c",
            scenario_id=sc3.id,
            title="Post in the company-wide channel publicly assigning blame to the engineer who merged PR #1402.",
            description="Name the individual engineer who wrote the retry code to explain the root cause.",
            sequence=3,
        )
        db.add(d3c)
        db.flush()
        db.add(DecisionOutcome(
            decision_id=d3c.id,
            title="Created toxic team friction and violated engineering blameless culture",
            description="Team morale plummeted and engineering leadership had to intervene regarding professional conduct.",
            consequence="Engineers became afraid to ship code due to fear of public embarrassment.",
            feedback="Unprofessional conduct. Modern engineering organizations uphold strict 'blameless post-mortems' to focus on systemic test coverage and process improvements rather than individual scapegoating.",
            score_delta=0,
            technical_score=5,
            reasoning_score=2,
            prioritization_score=3,
            communication_score=0,
            next_scenario_id=None,
        ))

        db.commit()
        print("Successfully seeded Software Engineer Production Incident Experience (3 scenarios, 13 evidence items, 9 decisions & outcomes, reflections)!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding experience simulation: {e}")
        raise e
    finally:
        if owns_session:
            db.close()


if __name__ == "__main__":
    seed_experiences()
