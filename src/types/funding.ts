export interface FundingSourceSchema {
  name: string;
  url: string;
  verified: boolean;
  last_verified_at: string;
  is_mock: boolean;
}

export interface FundingOptionPublicSchema {
  id: string;
  name: string;
  type: string;
  description: string;
  provider: string;
  target_education_level: string;
  target_career_categories: string[];
  location: string;
  amount_description: string;
  eligibility_summary: string;
  requirements: string[];
  application_information: string;
  source: FundingSourceSchema;
}

export interface FundingListResponse {
  items: FundingOptionPublicSchema[];
  total: number;
}

export interface FundingAnalyzeRequest {
  career_slug: string;
  education_path?: string | null;
  annual_budget: number;
  currency?: string;
  location?: string;
  query?: string;
  debug?: boolean;
}

export interface ValidatedFundingOptionSchema {
  id: string;
  name: string;
  type: string;
  provider: string;
  why_relevant: string;
  eligibility: string;
  amount: string;
  confidence: "supported" | "partially_supported";
  source: FundingSourceSchema;
}

export interface AgentTraceSchema {
  career_agent: string;
  funding_agent: string;
  validator: string;
  synthesizer: string;
}

export interface FundingNeedSchema {
  annual_budget: number;
  currency: string;
  estimated_annual_cost?: number | null;
  annual_deficit?: number | null;
}

export interface FundingAnalysisResponse {
  query: string;
  career: {
    id: string;
    slug: string;
    title: string;
  };
  funding_need: FundingNeedSchema;
  options: ValidatedFundingOptionSchema[];
  removed_claims: string[];
  uncertainties: string[];
  limitations: string[];
  disclaimer: string;
  trace?: AgentTraceSchema | null;
}
