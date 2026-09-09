import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Custom React hook for data fetching with loading, error, and refetch support.
 *
 * Usage:
 * ```tsx
 * const { data, loading, error, refetch } = useApiQuery(
 *   () => api.medicines.list(),
 *   []  // dependency array
 * );
 * ```
 */
export function useApiQuery<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = []
): {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Use a ref to track if the component is still mounted
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await fetcher();
      if (mountedRef.current) {
        setData(result);
      }
    } catch (err: any) {
      if (mountedRef.current) {
        setError(err.message || "An unexpected error occurred");
        console.error("[useApiQuery] Fetch error:", err);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();

    return () => {
      mountedRef.current = false;
    };
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}
