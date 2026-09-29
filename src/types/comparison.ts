export interface CareerSummaryHeader {
  id: string;
  slug: string;
  title: string;
  category: string;
  tagline: string;
}

export interface DimensionValue {
  value: string | null;
  details: string[];
  data_available: boolean;
  metadata?: Record<string, unknown> | null;
}

export interface ComparisonDimension {
  key: string;
  label: string;
  career_a: DimensionValue;
  career_b: DimensionValue;
}

export interface ComparisonTradeOffItem {
  dimension: string;
  label: string;
  summary: string;
}

export interface CareerComparisonResponse {
  career_a: CareerSummaryHeader;
  career_b: CareerSummaryHeader;
  dimensions: ComparisonDimension[];
  trade_offs: ComparisonTradeOffItem[];
  source: {
    name: string;
    url: string;
    verified: boolean;
    is_mock: boolean;
  };
  disclaimer: string;
}
