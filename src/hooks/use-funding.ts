import { useState, useCallback } from "react";
import { fundingApi } from "@/lib/api/funding";
import type {
  FundingAnalyzeRequest,
  FundingAnalysisResponse,
  FundingOptionPublicSchema,
} from "@/types";

export function useFundingAnalysis() {
  const [analysis, setAnalysis] = useState<FundingAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (payload: FundingAnalyzeRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fundingApi.analyzeFunding(payload);
      setAnalysis(data);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to generate funding analysis.";
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAnalysis(null);
    setError(null);
  }, []);

  return {
    analysis,
    isLoading,
    error,
    analyze,
    reset,
  };
}

export function useFundingCatalog() {
  const [options, setOptions] = useState<FundingOptionPublicSchema[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCatalog = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fundingApi.getFundingOptions();
      setOptions(res.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load funding catalog.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { options, isLoading, error, refetch: fetchCatalog };
}
