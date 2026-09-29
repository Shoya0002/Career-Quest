import { useState, useEffect, useCallback } from "react";
import { comparisonApi } from "@/lib/api/comparison";
import type { CareerComparisonResponse } from "@/types";

export function useCareerComparison(
  careerA: string = "software-engineer",
  careerB: string = "lawyer",
  dimensions?: string[]
) {
  const [comparison, setComparison] = useState<CareerComparisonResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComparison = useCallback(async () => {
    if (!careerA || !careerB) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await comparisonApi.compareCareers(careerA, careerB, dimensions);
      setComparison(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load career comparison.");
    } finally {
      setIsLoading(false);
    }
  }, [careerA, careerB, dimensions]);

  useEffect(() => {
    fetchComparison();
  }, [fetchComparison]);

  return { comparison, isLoading, error, refetch: fetchComparison };
}
