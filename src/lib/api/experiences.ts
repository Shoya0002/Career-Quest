import { apiClient } from "./client";
import type {
  ExperienceDetailResponse,
  ExperienceSessionCreateResponse,
  DecisionOutcomeResponse,
  ExperienceCompletionResultResponse,
} from "@/types";

export const experiencesApi = {
  async getExperience(slug: string): Promise<ExperienceDetailResponse> {
    return apiClient<ExperienceDetailResponse>(`/experiences/${encodeURIComponent(slug)}`);
  },

  async startSession(slug: string): Promise<ExperienceSessionCreateResponse> {
    return apiClient<ExperienceSessionCreateResponse>(`/experiences/${encodeURIComponent(slug)}/sessions`, {
      method: "POST",
    });
  },

  async getSessionState(sessionId: string): Promise<ExperienceSessionCreateResponse> {
    return apiClient<ExperienceSessionCreateResponse>(`/experience-sessions/${encodeURIComponent(sessionId)}`);
  },

  async submitDecision(
    sessionId: string,
    payload: { scenario_id: string; decision_id: string; rationale?: string }
  ): Promise<DecisionOutcomeResponse> {
    return apiClient<DecisionOutcomeResponse>(
      `/experience-sessions/${encodeURIComponent(sessionId)}/decisions`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  async getSessionResult(sessionId: string): Promise<ExperienceCompletionResultResponse> {
    return apiClient<ExperienceCompletionResultResponse>(
      `/experience-sessions/${encodeURIComponent(sessionId)}/result`
    );
  },
};
