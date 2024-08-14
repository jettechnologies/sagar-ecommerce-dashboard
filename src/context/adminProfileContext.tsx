import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './authContext';
import { AdminType } from '@/types';


type AdminProfileType = {
    admin: AdminType | null;
    isLoading: boolean;
    error: string | null;
}


// Create the context
const AdminContext = createContext<AdminProfileType | null>(null);

// Create the provider component
export const AdminProvider:React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { token, loading } = useAuth();
  const [admin, setAdmin] = useState<AdminType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_PRODUCT_LIST_API}admin-auth/profile`, {
            headers:{
                Authorization: `Bearer ${token}`,
            }
        });

        const adminData:AdminType = await response.json();
        setAdmin(adminData);
        
      } catch (err) {
        setError((err as Error).message);
        setIsLoading(false);
      }
      finally{
        setIsLoading(false);
      }
    };

    if(!loading && token){fetchData();}
  }, [token, loading]);

  return (
    <AdminContext.Provider value={{ admin, isLoading, error }}>
      {children}
    </AdminContext.Provider>
  );
};

export function useAdminProfile(): AdminProfileType {
    const context = useContext(AdminContext);
    if (!context) {
      throw new Error("useAdminProfiletContext must be used within a CartContextProvider");
    }
    return context;
  }