/**
 * CareerQuest - Pathway, Graph, and What-If Types
 * Supports React Flow visualization and Decision Matrix
 */

export type PathwayNodeType =
  | "education"
  | "certification"
  | "internship"
  | "entry_role"
  | "mid_role"
  | "senior_role"
  | "pivot_point";

export interface PathwayNodeData {
  title: string;
  subtitle: string;
  durationMonths: number;
  estimatedCost: number;
  avgCompletionRatePercent: number;
  nodeType: PathwayNodeType;
  isUnlocked?: boolean;
  requiredGpa?: number;
  notes?: string;
}

export interface PathwayFlowNode {
  id: string;
  type?: string;
  position: { x: number; y: number };
  data: PathwayNodeData;
}

export interface PathwayFlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  style?: Record<string, string | number>;
}

export interface Pathway {
  id: string;
  careerId: string;
  title: string;
  description: string;
  totalDurationYears: number;
  totalEstimatedCost: number;
  expectedBreakEvenYears: number;
  difficultyScore: number; // 1 - 10
  nodes: PathwayFlowNode[];
  edges: PathwayFlowEdge[];
  tags: string[];
}

export interface WhatIfConstraints {
  maxBudgetUsd: number;
  maxStudyYears: number;
  currentGpa: number;
  willingToRelocate: boolean;
  riskTolerance: "conservative" | "balanced" | "aggressive";
}

export interface TradeOffItem {
  dimension: string; // e.g. "Total Upfront Cost", "Years to First Job", "5-Year ROI"
  standardPathwayValue: string | number;
  adjustedPathwayValue: string | number;
  differenceFormatted: string;
  favorableTo: "standard" | "adjusted" | "neutral";
}

export interface WhatIfSimulationResult {
  viablePathways: Pathway[];
  recommendedPathwayId: string;
  tradeOffAnalysis: TradeOffItem[];
  agentSummaryAdvice: string;
}

export interface DecisionMatrixRow {
  careerId: string;
  careerName: string;
  academicMatchScore: number; // 0 - 100
  interestScore: number; // 0 - 100
  financialScore: number; // 0 - 100
  simulationExperienceScore: number; // 0 - 100
  marketStabilityScore: number; // 0 - 100
  compositeScore: number; // 0 - 100
}
