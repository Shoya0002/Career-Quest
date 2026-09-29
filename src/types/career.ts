/**
 * CareerQuest - Career Data Models
 */

export type IndustryType =
  | "technology"
  | "healthcare"
  | "business_finance"
  | "law_public_policy"
  | "engineering"
  | "creative_arts"
  | "science_research";

export type EducationLevel =
  | "high_school"
  | "associate"
  | "bachelor"
  | "master"
  | "doctorate"
  | "bootcamp_certification";

export interface SalaryRange {
  entry: number;
  median: number;
  senior: number;
  currency: string;
}

export interface SkillRequirement {
  id: string;
  name: string;
  category: "technical" | "soft" | "domain";
  importanceScore: number; // 1 - 10
}

export interface Career {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  summary: string;
  industry: IndustryType;
  primaryEducation: EducationLevel;
  salary: SalaryRange;
  projectedGrowthPercent: number; // e.g. 15 for 15%
  workLifeBalanceScore: number; // 1 - 10
  stressLevelScore: number; // 1 - 10
  requiredSkills: SkillRequirement[];
  dailyResponsibilities: string[];
  pros: string[];
  cons: string[];
  simulationAvailable: boolean;
  simulationId?: string;
  featured?: boolean;
}

export interface CareerFilterCriteria {
  searchQuery?: string;
  industries?: IndustryType[];
  educationLevels?: EducationLevel[];
  minSalary?: number;
  maxStressScore?: number;
  minWorkLifeBalanceScore?: number;
}

export interface CareerMatchResult {
  careerId: string;
  careerTitle: string;
  overallMatchPercentage: number;
  academicFitPercentage: number;
  interestFitPercentage: number;
  financialFeasibilityPercentage: number;
  keyStrengths: string[];
  potentialGaps: string[];
}
