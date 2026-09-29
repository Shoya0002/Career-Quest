import { useState, useEffect, useCallback } from "react";
import { experiencesApi } from "@/lib/api/experiences";
import type {
  ExperienceDetailResponse,
  ScenarioPublicResponse,
  DecisionOutcomeResponse,
  ExperienceCompletionResultResponse,
} from "@/types";

// Standard production simulation track data for fallback / offline resilience
const MOCK_SWE_INCIDENT: ExperienceDetailResponse = {
  id: "exp-swe-incident",
  slug: "production-incident",
  title: "Production Incident: The Payment API Latency Spike",
  category: "Technology",
  tagline: "Triage live telemetry, isolate root causes, and mitigate a critical production incident under pressure.",
  role_title: "Senior SRE / On-Call Lead",
  organization: "Global CloudCommerce",
  briefing:
    "A critical payment microservice anomaly has triggered customer-facing transaction timeouts during peak load. You will analyze telemetry, triage competing hypotheses, and make high-stakes operational engineering decisions.",
  total_scenarios: 3,
  first_scenario: {
    id: "sc-swe-01",
    sequence_order: 1,
    title: "The Production Alert",
    situation_brief:
      "At 14:22 UTC, PagerDuty triggers a high-severity alert: The core Checkout & Payments API error rate jumped from 0.1% to 38.4%, impacting customer transactions.",
    evidence_items: [
      {
        id: "ev-1",
        title: "Deployment Timeline",
        type: "timeline",
        preview_text: "Release v2.4.1 deployed 22 minutes ago...",
        full_content: "Release v2.4.1 (payment gateway retry optimization) was deployed to production 22 minutes ago by the backend platform team.",
        display_order: 0,
      },
      {
        id: "ev-2",
        title: "API Error Rate Metric",
        type: "metric",
        preview_text: "HTTP 504 Gateway Timeout surge...",
        full_content: "HTTP 504 Gateway Timeout and 500 Internal Server Errors surged on `/api/v1/payments/charge` starting exactly 3 minutes post-deploy.",
        display_order: 1,
      },
      {
        id: "ev-3",
        title: "Database Telemetry",
        type: "metric",
        preview_text: "PostgreSQL CPU is normal (18%)...",
        full_content: "Primary PostgreSQL cluster CPU load is 18%, connection pool is at 24/200, and query latencies for standard reads remain under 5ms.",
        display_order: 2,
      },
      {
        id: "ev-4",
        title: "Service Latency Graph",
        type: "metric",
        preview_text: "Payment API p99 latency spiked to 8,200ms...",
        full_content: "Payment API p99 latency spiked from 140ms to 8,200ms, while downstream catalog and inventory services report normal 45ms response times.",
        display_order: 3,
      },
    ],
    decisions: [
      {
        id: "dec-swe-1a",
        option_label: "A",
        title: "Correlate release diff and isolate retry loops",
        description: "Inspect Git PR commits in v2.4.1 to check outbound HTTP requests against external payment gateways.",
        display_order: 0,
      },
      {
        id: "dec-swe-1b",
        option_label: "B",
        title: "Scale out payment worker instances",
        description: "Triple worker pod count to absorb queuing pressure, without inspecting code changes.",
        display_order: 1,
      },
      {
        id: "dec-swe-1c",
        option_label: "C",
        title: "Restart PostgreSQL database nodes",
        description: "Perform rolling reboot of primary database under assumption of stale connection locks.",
        display_order: 2,
      },
    ],
  },
};

const MOCK_STAGE_2: ScenarioPublicResponse = {
  id: "sc-swe-02",
  sequence_order: 2,
  title: "Isolating Root Cause & Immediate Mitigation",
  situation_brief:
    "Your investigation confirms that v2.4.1 included an un-throttled synchronous retry loop against the external payment gateway, causing thread pool exhaustion under load.",
  evidence_items: [
    {
      id: "ev-2-1",
      title: "Git Pull Request #1402 Diff",
      type: "log",
      preview_text: "Merged commit b38a19: synchronous 5-attempt retry loop without jitter on HTTP 429.",
      full_content: "Merged commit b38a19: replaced async queuing with synchronous 5-attempt retry loop without jitter on HTTP 429.",
      display_order: 0,
    },
    {
      id: "ev-2-2",
      title: "Gateway Response Headers",
      type: "log",
      preview_text: "X-RateLimit-Remaining: 0, Retry-After: 60s.",
      full_content: "`X-RateLimit-Remaining: 0`, `Retry-After: 60s` returned by Stripe/Adyen gateway endpoints.",
      display_order: 1,
    },
    {
      id: "ev-2-3",
      title: "Rollback Safety Verification",
      type: "status",
      preview_text: "Zero DB schema migrations; v2.4.0 verified in CI/CD.",
      full_content: "Release v2.4.1 included zero database schema migrations; v2.4.0 is tagged and verified in the CI/CD pipeline.",
      display_order: 2,
    },
  ],
  decisions: [
    {
      id: "dec-swe-2a",
      option_label: "A",
      title: "Execute Immediate 90-Second Rollback to v2.4.0",
      description: "Trigger the automated pipeline to revert container images immediately to clean prior release.",
      display_order: 0,
    },
    {
      id: "dec-swe-2b",
      option_label: "B",
      title: "Push rapid in-line hotfix to disable retry logic",
      description: "Author emergency code change in master, bypass canary verification, and fast-track deployment.",
      display_order: 1,
    },
    {
      id: "dec-swe-2c",
      option_label: "C",
      title: "Throttle customer traffic with 503 Maintenance page",
      description: "Take the entire checkout funnel offline until a full engineering post-mortem can be scheduled.",
      display_order: 2,
    },
  ],
};

const MOCK_STAGE_3: ScenarioPublicResponse = {
  id: "sc-swe-03",
  sequence_order: 3,
  title: "Cross-Functional Incident Communication & Post-Mortem",
  situation_brief:
    "Traffic and error rates have stabilized back to normal baseline (0.04% error rate). The immediate outage is contained.",
  evidence_items: [
    {
      id: "ev-3-1",
      title: "Executive War Room Slack",
      type: "chat",
      preview_text: "VP Engineering: Need root cause and customer impact assessment.",
      full_content: "VP Engineering: 'Latency has returned to 45ms. Customer Support Director needs customer-facing messaging.'",
      display_order: 0,
    },
    {
      id: "ev-3-2",
      title: "Error Rate Telemetry (Post-Rollback)",
      type: "metric",
      preview_text: "API error rate dropped from 38.4% to 0.04%.",
      full_content: "Checkout error rate settled at 0.04% (normal baseline). All pending queue transactions drained successfully.",
      display_order: 1,
    },
  ],
  decisions: [
    {
      id: "dec-swe-3a",
      option_label: "A",
      title: "Publish transparent status update & schedule blameless post-mortem",
      description: "Share clear timeline with stakeholders, quantify affected carts, and schedule prevention review.",
      display_order: 0,
    },
    {
      id: "dec-swe-3b",
      option_label: "B",
      title: "Downplay incident severity to avoid executive scrutiny",
      description: "Report the incident as temporary external ISP packet loss and avoid logging internal Jira action items.",
      display_order: 1,
    },
    {
      id: "dec-swe-3c",
      option_label: "C",
      title: "Publicly assign blame to external payment vendor",
      description: "Send customer notice claiming the third-party gateway failed with zero internal responsibility.",
      display_order: 2,
    },
  ],
};

export function useExperienceSession(experienceSlug: string = "production-incident") {
  const resolvedSlug =
    experienceSlug === "software-engineer-incident" || !experienceSlug
      ? "production-incident"
      : experienceSlug;

  const [experience, setExperience] = useState<ExperienceDetailResponse | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentScenario, setCurrentScenario] = useState<ScenarioPublicResponse | null>(null);
  const [outcome, setOutcome] = useState<DecisionOutcomeResponse | null>(null);
  const [result, setResult] = useState<ExperienceCompletionResultResponse | null>(null);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  const [isLoadingMetadata, setIsLoadingMetadata] = useState<boolean>(true);
  const [isStartingSession, setIsStartingSession] = useState<boolean>(false);
  const [isSubmittingDecision, setIsSubmittingDecision] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Experience Metadata
  const loadExperience = useCallback(async () => {
    setIsLoadingMetadata(true);
    setError(null);
    try {
      const data = await experiencesApi.getExperience(resolvedSlug);
      setExperience(data);
      if (!currentScenario && data.first_scenario) {
        setCurrentScenario(data.first_scenario);
      }
    } catch (err) {
      // If backend is unreachable or not yet running, keep track of error but provide option to fallback
      const errorMsg = err instanceof Error ? err.message : "Failed to load simulation metadata.";
      setError(errorMsg);
    } finally {
      setIsLoadingMetadata(false);
    }
  }, [resolvedSlug, currentScenario]);

  useEffect(() => {
    loadExperience();
  }, [loadExperience]);

  // Activate Demo / Preview mode when backend is offline
  const startDemoMode = useCallback(() => {
    setError(null);
    setIsDemoMode(true);
    setExperience(MOCK_SWE_INCIDENT);
    setSessionId("demo_session_" + Date.now());
    setCurrentScenario(MOCK_SWE_INCIDENT.first_scenario ?? null);
    setTotalScore(0);
    setOutcome(null);
    setResult(null);
  }, []);

  // Start a fresh interactive session
  const startSession = useCallback(async () => {
    setIsStartingSession(true);
    setError(null);
    setOutcome(null);
    setResult(null);
    setTotalScore(0);

    try {
      const sessionData = await experiencesApi.startSession(resolvedSlug);
      setSessionId(sessionData.session_id);
      const scenario = sessionData.current_scenario || sessionData.first_scenario;
      setCurrentScenario(scenario ?? null);
    } catch (err) {
      // Graceful fallback to sandbox simulation
      console.warn("Backend session creation failed, switching to sandbox preview:", err);
      startDemoMode();
    } finally {
      setIsStartingSession(false);
    }
  }, [resolvedSlug, startDemoMode]);

  // Submit a decision
  const submitDecision = useCallback(
    async (decisionId: string, rationale?: string) => {
      if (!sessionId || !currentScenario) {
        setError("No active simulation session found. Please start a new session.");
        return;
      }

      setIsSubmittingDecision(true);
      setError(null);

      // Handle Sandbox / Demo Mode locally
      if (isDemoMode || sessionId.startsWith("demo_")) {
        setTimeout(() => {
          let scoreDelta = 25;
          let consequenceText = "Your triage strategy successfully isolated the incident bottleneck.";
          let outcomeHeadline = "Telemetry Correlated Successfully";
          let nextSc: ScenarioPublicResponse | null = null;
          let isFinal = false;

          const seq = currentScenario.sequence_order || (currentScenario as any).sequence || 1;

          if (seq === 1) {
            scoreDelta = decisionId === "dec-swe-1a" ? 25 : 10;
            outcomeHeadline = "Telemetry & Code Diff Correlated";
            consequenceText =
              "Inspecting release v2.4.1 pinpointed un-throttled retry loops calling the payment gateway. DB CPU is healthy, confirming downstream bottleneck.";
            nextSc = MOCK_STAGE_2;
          } else if (seq === 2) {
            scoreDelta = decisionId === "dec-swe-2a" ? 25 : 15;
            outcomeHeadline = "Rollback Executed: Latency Normalizing";
            consequenceText =
              "The pipeline reverted to verified release v2.4.0 in 84 seconds. Thread pool utilization dropped from 100% to 14%. Checkout error rate fell below 0.1%.";
            nextSc = MOCK_STAGE_3;
          } else {
            scoreDelta = decisionId === "dec-swe-3a" ? 25 : 10;
            outcomeHeadline = "Incident Resolved & Documented";
            consequenceText =
              "Transparent communication restored leadership trust. The blameless post-mortem created defensive circuit-breaker tickets for future sprints.";
            isFinal = true;
          }

          const newScore = totalScore + scoreDelta;
          setTotalScore(newScore);

          const demoOutcome: DecisionOutcomeResponse = {
            outcome_headline: outcomeHeadline,
            consequence_text: consequenceText,
            reflection_prompt:
              "How did your triage order balance speed against operational stability under alert pressure?",
            performance_delta: {
              score_delta: scoreDelta,
              new_total_score: newScore,
            },
            is_final_scenario: isFinal,
            next_scenario: nextSc,
          };

          setOutcome(demoOutcome);

          if (isFinal) {
            const demoResult: ExperienceCompletionResultResponse = {
              session_id: sessionId,
              status: "completed",
              final_score: Math.min(100, newScore),
              performance_breakdown: {
                problem_solving: 92,
                technical_accuracy: 88,
                collaboration_communication: 90,
                stress_management: 86,
              },
              decision_history: [
                {
                  scenario_order: 1,
                  scenario_title: "The Production Alert",
                  selected_option_label: "A",
                  decision_title: "Correlate release diff and isolate retry loops",
                  outcome_headline: "Telemetry Correlated",
                  consequence_text: "Isolated un-throttled synchronous retry loop calling external payment gateway.",
                  score_awarded: 25,
                },
                {
                  scenario_order: 2,
                  scenario_title: "Isolating Root Cause & Immediate Mitigation",
                  selected_option_label: "A",
                  decision_title: "Execute Immediate 90-Second Rollback to v2.4.0",
                  outcome_headline: "Clean Rollback Completed",
                  consequence_text: "Reverted release without DB migrations in under 90s, restoring checkout traffic.",
                  score_awarded: 25,
                },
                {
                  scenario_order: 3,
                  scenario_title: "Cross-Functional Incident Communication",
                  selected_option_label: "A",
                  decision_title: "Publish transparent status update & schedule blameless post-mortem",
                  outcome_headline: "Outage Resolved",
                  consequence_text: "Maintained executive trust and scheduled proactive circuit-breaker safeguards.",
                  score_awarded: 25,
                },
              ],
              reflection_prompts: [
                "When the PagerDuty alert fired, did you rely on system metrics to form a hypothesis, or did you feel an impulse to guess?",
                "How did the tension between executing an immediate 90-second rollback versus writing a live code hotfix influence your calculation of operational risk?",
                "Did diagnosing production telemetry and coordinating incident response under time constraints feel intellectually energizing or stressful?",
              ],
            };
            setResult(demoResult);
          }

          setIsSubmittingDecision(false);
        }, 300);
        return;
      }

      // Live Backend Submission
      try {
        const outcomeData = await experiencesApi.submitDecision(sessionId, {
          scenario_id: currentScenario.id,
          decision_id: decisionId,
          rationale,
        });

        setOutcome(outcomeData);
        const scoreDelta =
          outcomeData.performance_delta?.score_delta ??
          (outcomeData as any)?.performance?.score_delta ??
          25;
        const newScore =
          outcomeData.performance_delta?.new_total_score ?? totalScore + scoreDelta;
        setTotalScore(newScore);

        const isFinal =
          outcomeData.is_final_scenario ?? (outcomeData as any)?.is_completed ?? false;

        if (isFinal) {
          const resultData = await experiencesApi.getSessionResult(sessionId);
          setResult(resultData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to submit decision to simulation engine.");
      } finally {
        setIsSubmittingDecision(false);
      }
    },
    [sessionId, currentScenario, isDemoMode, totalScore]
  );

  // Advance to next scenario after reviewing outcome
  const nextScenario = useCallback(() => {
    if (!outcome) return;
    if (outcome.next_scenario) {
      setCurrentScenario(outcome.next_scenario);
      setOutcome(null);
    }
  }, [outcome]);

  // Reset simulation
  const resetSession = useCallback(() => {
    setSessionId(null);
    setOutcome(null);
    setResult(null);
    setTotalScore(0);
    if (experience?.first_scenario) {
      setCurrentScenario(experience.first_scenario);
    }
  }, [experience]);

  return {
    experience,
    sessionId,
    currentScenario,
    outcome,
    result,
    totalScore,
    isDemoMode,
    isLoadingMetadata,
    isStartingSession,
    isSubmittingDecision,
    error,
    startSession,
    startDemoMode,
    submitDecision,
    nextScenario,
    resetSession,
    refetchMetadata: loadExperience,
  };
}
