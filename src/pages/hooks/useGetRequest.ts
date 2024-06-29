import { useState, useEffect } from 'react';

interface UseGetRequestOptions {
  headers?: HeadersInit;
}

type UseGetRequestResponse<T> = {
  data: T | [];
  error: string | null;
  loading: boolean;
};

const useGetRequest = <T>(url: string, options?: UseGetRequestOptions, fetchFlag = true): UseGetRequestResponse<T> => {
  const [data, setData] = useState<T | []>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!fetchFlag) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${import.meta.env.VITE_PRODUCT_LIST_API}${url}`, {
          headers: options?.headers,
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse?.message || "Resource not found");
        }

        const result: [T, number] = await response.json();
        setData(result[0]);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, options?.headers, fetchFlag]);

  return { data, error, loading };
};

export default useGetRequest;
