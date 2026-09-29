import { apiClient } from "./client";
import type { WhatIfRequest, WhatIfResponse } from "@/types";

export const whatIfApi = {
  async simulateWhatIf(careerSlug: string, constraints: WhatIfRequest): Promise<WhatIfResponse> {
    return apiClient<WhatIfResponse>(`/careers/${encodeURIComponent(careerSlug)}/what-if`, {
      method: "POST",
      body: JSON.stringify(constraints),
    });
  },
};
