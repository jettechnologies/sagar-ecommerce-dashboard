import { useState, useCallback } from "react";
import { EasyHTTP } from "@/utils/httpRequest";

interface Categories{
    name: string;
    description: string;
    id: number;
    banner: string;
    createdAt: Date;
    updatedAt: Date;
}

const easyHttp = new EasyHTTP;

export const useCategories = () => {
  const [categories, setCategories] = useState<Categories[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);


  const getCategories = useCallback(
    async (): Promise<void> => {
        try {
          setIsLoading(true);
          const res = await easyHttp.get("browse/fetch-all-product-categories");
          setCategories(res[0])
          setIsError(null);
        } catch (e: any) {
            setIsError(e.message);
          throw new Error(e.message)
        } finally {
          setIsLoading(false);
        }
      },

    []
  );

  return { categories, isLoading, isError, getCategories };
};


// browse/fetch-all-product-categories