import { apiClient } from "./client";
import type {
  FundingListResponse,
  FundingOptionPublicSchema,
  FundingAnalyzeRequest,
  FundingAnalysisResponse,
} from "@/types";

export interface GetFundingParams {
  career_category?: string;
  education_level?: string;
  location?: string;
  type?: string;
}

export const fundingApi = {
  async getFundingOptions(params: GetFundingParams = {}): Promise<FundingListResponse> {
    const query = new URLSearchParams();
    if (params.career_category) query.append("career_category", params.career_category);
    if (params.education_level) query.append("education_level", params.education_level);
    if (params.location) query.append("location", params.location);
    if (params.type) query.append("type", params.type);

    const qs = query.toString() ? `?${query.toString()}` : "";
    return apiClient<FundingListResponse>(`/funding${qs}`);
  },

  async getFundingOptionById(id: string): Promise<FundingOptionPublicSchema> {
    return apiClient<FundingOptionPublicSchema>(`/funding/${encodeURIComponent(id)}`);
  },

  async analyzeFunding(payload: FundingAnalyzeRequest): Promise<FundingAnalysisResponse> {
    return apiClient<FundingAnalysisResponse>("/funding/analyze", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
