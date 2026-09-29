/**
 * CareerQuest - Simulation Engine Component Primitives
 * Placeholder barrel for scenario runner, choice cards, and agent council debaters
 */

export interface SimulationRunnerProps {
  scenarioId: string;
  onComplete?: () => void;
}
export * from "./experience-lab";
export * from "./simulation-player";
export * from "./experience-report";
