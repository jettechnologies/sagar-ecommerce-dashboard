import { useState, useCallback } from 'react';
import { Headers, EasyHTTP } from '@/utils/httpRequest';

const easyHttp = new EasyHTTP();

interface UseFormDataProps {
  url: string;
  headers: Headers;
  formData: FormData;
  method?: 'post' | 'patch' | 'put' | 'delete';
}

interface UseFormDataReturn {
  data: any;
  error: string | null;
  loading: boolean;
  execute: () => Promise<void>;
}

export const useFormData = ({
  url,
  headers,
  formData,
  method = 'post',
}: UseFormDataProps): UseFormDataReturn => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await easyHttp.formData(url, headers, formData, method);
      setData(response);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [url, headers, formData, method]);

  return { data, error, loading, execute };
};
