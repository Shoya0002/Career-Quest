import { useState, useEffect, useCallback } from "react";
import { careersApi, GetCareersParams } from "@/lib/api/careers";
import type {
  CareerListItem,
  CareerDetailResponse,
  CareerPathwayResponse,
} from "@/types";

export function useCareers(params: GetCareersParams = {}) {
  const [careers, setCareers] = useState<CareerListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCareers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await careersApi.getCareers(params);
      setCareers(response.items);
      setTotal(response.total);
      setTotalPages(response.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load careers catalog.");
    } finally {
      setIsLoading(false);
    }
  }, [params.search, params.category, params.page, params.limit]);

  useEffect(() => {
    fetchCareers();
  }, [fetchCareers]);

  return { careers, total, totalPages, isLoading, error, refetch: fetchCareers };
}

export function useCareer(slug: string) {
  const [career, setCareer] = useState<CareerDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCareer = useCallback(async () => {
    if (!slug) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await careersApi.getCareerBySlug(slug);
      setCareer(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to load career profile for '${slug}'.`);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchCareer();
  }, [fetchCareer]);

  return { career, isLoading, error, refetch: fetchCareer };
}

export function useCareerPathway(slug: string) {
  const [pathway, setPathway] = useState<CareerPathwayResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPathway = useCallback(async () => {
    if (!slug) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await careersApi.getCareerPathway(slug);
      setPathway(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to load career pathway for '${slug}'.`);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchPathway();
  }, [fetchPathway]);

  return { pathway, isLoading, error, refetch: fetchPathway };
}
