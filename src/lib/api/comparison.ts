import { apiClient } from "./client";
import type { CareerComparisonResponse } from "@/types";

export const comparisonApi = {
  async compareCareers(
    careerA: string,
    careerB: string,
    dimensions?: string[]
  ): Promise<CareerComparisonResponse> {
    const query = new URLSearchParams({
      career_a: careerA,
      career_b: careerB,
    });
    if (dimensions && dimensions.length > 0) {
      query.append("dimensions", dimensions.join(","));
    }
    return apiClient<CareerComparisonResponse>(`/careers/compare?${query.toString()}`);
  },
};
