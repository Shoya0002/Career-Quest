import { PathwayNodeSchema, PathwayEdgeSchema } from "./career";

export interface WhatIfRequest {
  education_path?: string | null;
  annual_budget: number;
  currency?: string;
  location?: string;
  study_abroad?: boolean;
}

export interface PathwayOptionSchema {
  id: string;
  title: string;
  education_path: string;
  estimated_duration_years: number;
  annual_estimated_cost: number;
  cost_label: string;
  location_type: string;
  study_abroad_supported: boolean;
  nodes: PathwayNodeSchema[];
  edges: PathwayEdgeSchema[];
}

export interface WhatIfResultGroupSchema {
  available: PathwayOptionSchema[];
  requires_funding: PathwayOptionSchema[];
  affected: PathwayOptionSchema[];
  excluded: PathwayOptionSchema[];
}

export interface PathwayChangeExplanationSchema {
  pathway_id: string;
  pathway_title: string;
  change_type: "available" | "requires_funding" | "affected" | "excluded";
  reason: string;
  funding_gap: number;
  suggested_actions: string[];
}

export interface WhatIfResponse {
  career: {
    id: string;
    slug: string;
    title: string;
  };
  constraints: {
    education_path: string;
    annual_budget: number;
    currency: string;
    location: string;
    study_abroad: boolean;
  };
  pathways: WhatIfResultGroupSchema;
  changes: PathwayChangeExplanationSchema[];
  summary: string;
}
