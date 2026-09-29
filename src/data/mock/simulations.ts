import type { SimulationScenario } from "@/types";

export const MOCK_SIMULATIONS: SimulationScenario[] = [
  {
    id: "sim-swe-incident",
    careerId: "software-engineer",
    professionTitle: "Software Engineer",
    companyContext: "CloudScale Inc. — Series B Fintech Infrastructure",
    roleTitle: "L4 Software Engineer (Core Payments)",
    difficulty: "intermediate",
    estimatedMinutes: 12,
    overview:
      "A critical payment gateway deployment causes latency spikes 15 minutes before the biggest e-commerce shopping festival of the year. Balance speed, system integrity, and company revenue.",
    learningObjectives: [
      "Understand root-cause analysis vs emergency rollbacks",
      "Experience cross-functional engineering stress during outages",
      "Observe trade-offs between technical perfection and immediate business continuity",
    ],
    initialMetrics: {
      technicalCompetence: 70,
      stressLevel: 45,
      ethicsScore: 80,
      financialImpact: 85,
      teamSatisfaction: 75,
    },
    stages: [
      {
        id: "stage-1",
        order: 1,
        title: "Latency Anomaly Alert",
        situation:
          "The P99 API latency on the payment ingestion cluster surged from 45ms to 1,200ms right after your team's scheduled release. 3.2% of transactions are failing. Your engineering lead is in another incident channel.",
        roleContext: "You have full write access to the deployment configuration and database replica cluster.",
        systemAlert: "CRITICAL: P99 Latency > 1000ms. Error Rate 3.2%",
        choices: [
          {
            id: "c1-rollback",
            label: "Initiate Immediate Canary Rollback",
            description: "Revert the newly deployed release back to the previous stable build within 90 seconds.",
            agentDebates: [
              {
                agentRole: "simulation",
                agentName: "Simulation Agent",
                advice: "Safest operational play. Protects transaction flow before traffic doubles.",
                stance: "pro",
              },
              {
                agentRole: "career",
                agentName: "Career Strategist Agent",
                advice: "Shows disciplined adherence to SRE principles. Demonstrates mature judgment.",
                stance: "pro",
              },
              {
                agentRole: "funding",
                agentName: "Financial Agent",
                advice: "Saves up to $18,000/minute in dropped transactions.",
                stance: "pro",
              },
            ],
            impact: {
              technicalCompetence: 8,
              stressLevel: -10,
              ethicsScore: 5,
              financialImpact: 10,
              teamSatisfaction: 5,
            },
            feedbackText: "The canary rollback stabilized latency back down to 42ms. The incident was contained with minimal customer impact.",
            nextStageId: "stage-2",
          },
          {
            id: "c1-hotfix",
            label: "Attempt Live In-Memory Cache Hotfix",
            description: "Patch the database query cache lock directly in production to preserve the new feature flags.",
            agentDebates: [
              {
                agentRole: "simulation",
                agentName: "Simulation Agent",
                advice: "Extreme risk. If the cache lock deadlocks, the entire cluster drops.",
                stance: "caution",
              },
              {
                agentRole: "career",
                agentName: "Career Strategist Agent",
                advice: "High heroics can backfire. Junior engineers often make this mistake.",
                stance: "con",
              },
              {
                agentRole: "funding",
                agentName: "Financial Agent",
                advice: "Feature retention isn't worth an unrecoverable database deadlock.",
                stance: "con",
              },
            ],
            impact: {
              technicalCompetence: -5,
              stressLevel: 25,
              ethicsScore: -5,
              financialImpact: -15,
              teamSatisfaction: -10,
            },
            feedbackText: "The lock held temporarily, but secondary worker pools choked on thread exhaustion. Latency spiked to 2,400ms before senior engineers intervened.",
            nextStageId: "stage-2",
          },
        ],
      },
      {
        id: "stage-2",
        order: 2,
        title: "Post-Mortem & Blameless Review",
        situation:
          "The incident is stabilized. During the post-incident retrospective, you discover the root cause was an unindexed database query in a PR approved by your senior teammate.",
        roleContext: "The VP of Engineering and the team are reviewing the incident documentation.",
        choices: [
          {
            id: "c2-blameless",
            label: "Frame as a Systemic Testing Gap & Propose Automated Linter",
            description: "Focus on why CI/CD didn't catch missing indexes instead of individual blame.",
            agentDebates: [
              {
                agentRole: "career",
                agentName: "Career Strategist Agent",
                advice: "Exemplary staff-engineer behavior. Builds psychological safety across the organization.",
                stance: "pro",
              },
              {
                agentRole: "simulation",
                agentName: "Simulation Agent",
                advice: "Prevents defensiveness and creates long-term institutional resilience.",
                stance: "pro",
              },
            ],
            impact: {
              technicalCompetence: 12,
              stressLevel: -5,
              ethicsScore: 10,
              financialImpact: 5,
              teamSatisfaction: 15,
            },
            feedbackText: "Leadership applauded your constructive approach, and you were invited to lead the automated query verification initiative.",
            nextStageId: null,
          },
        ],
      },
    ],
  },
];
