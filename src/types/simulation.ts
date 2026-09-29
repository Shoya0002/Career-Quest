/**
 * CareerQuest - Simulation Engine Models
 * Interactive profession simulations and agent debates
 */

export type SimulationDifficulty = "beginner" | "intermediate" | "advanced";

export type AgentRoleType = "career" | "funding" | "simulation";

export interface AgentPerspective {
  agentRole: AgentRoleType;
  agentName: string;
  advice: string;
  stance: "pro" | "con" | "neutral" | "caution";
}

export interface MetricImpact {
  technicalCompetence: number; // e.g. -10 to +10
  stressLevel: number;
  ethicsScore: number;
  financialImpact: number;
  teamSatisfaction: number;
}

export interface SimulationChoice {
  id: string;
  label: string;
  description: string;
  agentDebates: AgentPerspective[];
  impact: MetricImpact;
  feedbackText: string;
  nextStageId: string | null; // null indicates end of scenario
}

export interface SimulationStage {
  id: string;
  order: number;
  title: string;
  situation: string;
  roleContext: string;
  systemAlert?: string;
  choices: SimulationChoice[];
}

export interface SimulationScenario {
  id: string;
  careerId: string;
  professionTitle: string;
  companyContext: string;
  roleTitle: string;
  difficulty: SimulationDifficulty;
  estimatedMinutes: number;
  overview: string;
  learningObjectives: string[];
  initialMetrics: MetricImpact;
  stages: SimulationStage[];
}

export interface SimulationHistoryEntry {
  stageId: string;
  chosenChoiceId: string;
  timestamp: string;
  metricsAfterChoice: MetricImpact;
}

export interface SimulationSessionState {
  sessionId: string;
  scenarioId: string;
  currentStageId: string;
  currentMetrics: MetricImpact;
  history: SimulationHistoryEntry[];
  isCompleted: boolean;
  finalScore?: number;
  debriefSummary?: string;
}
