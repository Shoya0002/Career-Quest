import { apiClient } from "./client";
import type {
  CareerListPaginationResponse,
  CareerDetailResponse,
  CareerPathwayResponse,
} from "@/types";

export interface GetCareersParams {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export const careersApi = {
  async getCareers(params: GetCareersParams = {}): Promise<CareerListPaginationResponse> {
    const query = new URLSearchParams();
    if (params.search) query.append("search", params.search);
    if (params.category && params.category !== "all") query.append("category", params.category);
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());

    const qs = query.toString() ? `?${query.toString()}` : "";
    return apiClient<CareerListPaginationResponse>(`/careers${qs}`);
  },

  async getCareerBySlug(slug: string): Promise<CareerDetailResponse> {
    return apiClient<CareerDetailResponse>(`/careers/${encodeURIComponent(slug)}`);
  },

  async getCareerPathway(slug: string): Promise<CareerPathwayResponse> {
    return apiClient<CareerPathwayResponse>(`/careers/${encodeURIComponent(slug)}/pathway`);
  },
};
