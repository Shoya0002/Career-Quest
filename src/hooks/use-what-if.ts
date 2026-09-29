import { useState, useCallback } from "react";
import { whatIfApi } from "@/lib/api/whatIf";
import type { WhatIfRequest, WhatIfResponse } from "@/types";

export function useWhatIf(careerSlug: string = "software-engineer") {
  const [result, setResult] = useState<WhatIfResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const runSimulation = useCallback(
    async (constraints: WhatIfRequest) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await whatIfApi.simulateWhatIf(careerSlug, constraints);
        setResult(data);
        return data;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to run What-If recalculation.";
        setError(msg);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [careerSlug]
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    result,
    isLoading,
    error,
    runSimulation,
    reset,
  };
}
