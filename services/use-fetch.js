import { useState, useEffect, useCallback } from "react";

const useFetch = (fetchFunction, autoFetch = true) => {
  const [data, setData] = useState([]); // 👈 use [] not null
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(Array.isArray(result) ? result : []); // 👈 ensure it's an array
    } catch (err) {
      setError(err instanceof Error ? err : new Error("An unknown error occurred"));
      setData([]); // 👈 reset to empty on error
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  const reset = () => {
    setData([]); // 👈 reset to empty array
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    if (autoFetch) fetchData();
  }, [autoFetch, fetchData]);

  return { data, loading, error, refetch: fetchData, reset };
};

export default useFetch;
