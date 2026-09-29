/**
 * CareerQuest API Client
 * Connects frontend to the FastAPI backend
 */

import { API_ENDPOINTS } from "./constants";
import type {
  Career,
  SimulationScenario,
  SimulationSessionState,
  WhatIfConstraints,
  WhatIfSimulationResult,
  Pathway,
  UserProfile,
  AgentPerspective,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = "ApiError";
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorData: unknown;
    try {
      errorData = await response.json();
    } catch {
      errorData = await response.text();
    }
    throw new ApiError(response.status, response.statusText, errorData);
  }

  return response.json() as Promise<T>;
}

export const api = {
  // Careers
  async getCareers(): Promise<Career[]> {
    return request<Career[]>(API_ENDPOINTS.CAREERS);
  },

  async getCareerById(id: string): Promise<Career> {
    return request<Career>(`${API_ENDPOINTS.CAREERS}/${id}`);
  },

  // Simulations
  async getSimulations(): Promise<SimulationScenario[]> {
    return request<SimulationScenario[]>(API_ENDPOINTS.SIMULATIONS);
  },

  async getSimulationById(id: string): Promise<SimulationScenario> {
    return request<SimulationScenario>(`${API_ENDPOINTS.SIMULATIONS}/${id}`);
  },

  async submitSimulationStep(
    sessionId: string,
    choiceId: string
  ): Promise<SimulationSessionState> {
    return request<SimulationSessionState>(API_ENDPOINTS.SIMULATION_STEP, {
      method: "POST",
      body: JSON.stringify({ sessionId, choiceId }),
    });
  },

  // AI Agent Council Debate
  async triggerAgentDebate(payload: {
    careerId: string;
    topic: string;
    options: string[];
  }): Promise<{ perspectives: AgentPerspective[]; synthesis: string }> {
    return request<{ perspectives: AgentPerspective[]; synthesis: string }>(
      API_ENDPOINTS.AGENT_DEBATE,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
  },

  // What-If Engine
  async simulateWhatIf(
    constraints: WhatIfConstraints
  ): Promise<WhatIfSimulationResult> {
    return request<WhatIfSimulationResult>(API_ENDPOINTS.WHAT_IF, {
      method: "POST",
      body: JSON.stringify(constraints),
    });
  },

  // Pathways & React Flow Graphs
  async getPathways(careerId?: string): Promise<Pathway[]> {
    const query = careerId ? `?careerId=${encodeURIComponent(careerId)}` : "";
    return request<Pathway[]>(`${API_ENDPOINTS.PATHWAYS}${query}`);
  },

  // User Profile
  async getUserProfile(): Promise<UserProfile> {
    return request<UserProfile>(API_ENDPOINTS.USER_PROFILE);
  },

  async updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    return request<UserProfile>(API_ENDPOINTS.USER_PROFILE, {
      method: "PATCH",
      body: JSON.stringify(profile),
    });
  },
};
