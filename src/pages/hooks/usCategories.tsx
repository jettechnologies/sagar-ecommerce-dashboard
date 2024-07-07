import { useState, useCallback } from "react";
import { EasyHTTP } from "@/utils/httpRequest";
import { CategoryType } from "@/types";



const easyHttp = new EasyHTTP;

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryType[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);


  const getCategories = useCallback(
    async (): Promise<void> => {
        try {
          setIsLoading(true);
          const res = await easyHttp.get("browse/fetch-all-product-categories");
          console.log(res)
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