import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import { AdminType } from '@/types';

// Define the shape of the context state
interface AuthState {
  token: string;
  isLogin: boolean;
  adminProfile: AdminType | null;
}

// Define the shape of the context methods
interface AuthContextProps extends AuthState {
  setToken: (token: string) => void;
  // setIsLogin: (isLogin: boolean) => void;
  setAdminProfile: (adminProfile: AdminType) => void;
}

// Create the context with default values
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// AuthProvider component to wrap around components that need access to the context
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string>('');
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [adminProfile, setAdminProfile] = useState<AdminType | null>(null);

  useEffect(() =>{
    const auth = Cookies.get("auth");
    if(auth){
      const auth_string = JSON.parse(auth);
      const { accesstoken, admin } = auth_string;
      setToken(accesstoken.token);
      setAdminProfile(admin);
      setIsLogin(true)
    }
    // if(auth_token){
    //     setToken(auth_token);
    //     setIsLogin(true);
    // }
  }, []);

  useEffect(() =>{
    if(token){
      setIsLogin(true);
    }
  }, [token, setIsLogin])

  return (
    <AuthContext.Provider value={{ token, isLogin, setToken, setAdminProfile, adminProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
