import { useState, useCallback } from "react";
import { EasyHTTP, Headers, Data } from "@/utils/httpRequest";

const easyHttp = new EasyHTTP;

export const useUserForm = () => {
  const [response, setResponse] = useState<string | null >(null);
  const [loading, setLoading] = useState(false);
  const [resError, setResError] = useState<string | null>(null);

  const getUserFormData = useCallback(async (url: string, headers: Headers, data: Data): Promise<void> => {
    try {
      setLoading(true);
      const res = await easyHttp.post(url, headers, data);
      setResponse(res)
      setResError(null);
    } catch (e: any) {
      console.log(e.message)
      setResError(e.message);

      throw new Error(e.message)
    } finally {
      setLoading(false);
    }
  }, []);

  return { response, loading, resError, getUserFormData};
};