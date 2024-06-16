import { useState, useCallback } from "react";
import { AdminDataType } from "@/types";

export const useAdminData = () => {
  const [adminData, setAdminData] = useState<AdminDataType[] | []>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);


//   const getAdminData = useCallback(
//     async (
//         token:string,
//     ): Promise<void> => {
//         try {
//           setIsLoading(true);
//           const res = await fetch("browse/fetch-all-product-categories", {
//             headers : {
//                 'Authorization': `Bearer ${token}`,
//             }
//           });
//           setAdminData(res[0])
//           setIsError(null);
//         } catch (e: any) {
//             setIsError(e.message);
//           throw new Error(e.message)
//         } finally {
//           setIsLoading(false);
//         }
//       },

//     []
//   );

const getAdminData = useCallback(
    async (
      token: string,
    ): Promise<void> => {
      try {
        setIsLoading(true);
        const res: Response = await fetch("https://sagar-e-commerce-backend.onrender.com/api/v1/sagar_stores_api/admins-mgt/all-other-admins", {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        const data: AdminDataType[] = await res.json();
        setAdminData(data);
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

  return { adminData, isLoading, isError, getAdminData };
};


// browse/fetch-all-product-categories