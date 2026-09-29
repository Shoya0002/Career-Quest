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
  | "vocational"
  | "associate"
  | "bachelor"
  | "master"
  | "doctorate"
  | "bootcamp";

export interface SkillRequirement {
  id: string;
  name: string;
  category: "technical" | "soft" | "domain";
  importanceScore: number;
}

export interface CareerSalary {
  entry: number;
  median: number;
  senior: number;
  currency: string;
}

export interface Career {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  summary: string;
  industry: IndustryType;
  primaryEducation: EducationLevel;
  salary: CareerSalary;
  projectedGrowthPercent: number;
  workLifeBalanceScore: number;
  stressLevelScore: number;
  requiredSkills: SkillRequirement[];
  dailyResponsibilities: string[];
  pros: string[];
  cons: string[];
  simulationAvailable: boolean;
  simulationId?: string;
  featured?: boolean;
}

export interface AtAGlanceSchema {
  median_pay: string;
  projected_growth: string;
  work_life_context: string;
  stress_context: string;
}

export interface CareerListItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  tagline: string;
  at_a_glance: AtAGlanceSchema;
  key_skills: string[];
}

export interface CareerListPaginationResponse {
  items: CareerListItem[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface SkillItemSchema {
  skill_name: string;
  skill_type: "technical" | "professional";
  importance_score: number;
}

export interface SkillsGroupSchema {
  technical: SkillItemSchema[];
  professional: SkillItemSchema[];
}

export interface EducationPhaseItemSchema {
  title: string;
  description: string;
  duration?: string | null;
  estimated_cost?: string | null;
}

export interface EducationGroupSchema {
  after_class_10: EducationPhaseItemSchema[];
  after_class_12: EducationPhaseItemSchema[];
  entrance_requirements: EducationPhaseItemSchema[];
  certifications: EducationPhaseItemSchema[];
}

export interface ProgressionStepSchema {
  level_title: string;
  experience_range: string;
  typical_role: string;
  salary_range: string;
}

export interface SpecializationSchema {
  title: string;
  description: string;
  market_demand: string;
}

export interface FinancialItemSchema {
  title: string;
  amount_or_range: string;
  notes?: string | null;
}

export interface FinancialGroupSchema {
  education_cost: FinancialItemSchema[];
  additional_costs: FinancialItemSchema[];
  funding_options: FinancialItemSchema[];
}

export interface PracticalConsiderationsSchema {
  positive_aspects: string[];
  challenges: string[];
}

export interface OpportunityItemSchema {
  name: string;
  description: string;
}

export interface OpportunitiesGroupSchema {
  industries: OpportunityItemSchema[];
  work_models: OpportunityItemSchema[];
  geographic_options: OpportunityItemSchema[];
}

export interface CareerDetailResponse {
  id: string;
  slug: string;
  title: string;
  category: string;
  tagline: string;
  overview: string;
  at_a_glance: AtAGlanceSchema;
  responsibilities: string[];
  skills: SkillsGroupSchema;
  education: EducationGroupSchema;
  progression: ProgressionStepSchema[];
  specializations: SpecializationSchema[];
  financials: FinancialGroupSchema;
  practical_considerations: PracticalConsiderationsSchema;
  opportunities: OpportunitiesGroupSchema;
}

export interface ApiPathwayNodeData {
  title: string;
  subtitle?: string;
  durationMonths?: number;
  estimatedCost?: number;
  nodeType: string;
}

export interface PathwayNodeSchema {
  id: string;
  position: { x: number; y: number };
  data: ApiPathwayNodeData;
}

export interface PathwayEdgeSchema {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
}

export interface CareerPathwayResponse {
  career_id: string;
  career_slug: string;
  title: string;
  description: string;
  total_duration_years: number;
  total_estimated_cost: string;
  expected_breakeven_years: number;
  difficulty_score: number;
  nodes: PathwayNodeSchema[];
  edges: PathwayEdgeSchema[];
}
