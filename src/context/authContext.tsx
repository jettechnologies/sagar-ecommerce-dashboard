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
  setAdminProfile: (adminProfile: AdminType) => void;
}

// Create the context with default values
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// AuthProvider component to wrap around components that need access to the context
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string>('');
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [adminProfile, setAdminProfile] = useState<AdminType | null>(null);

  useEffect(() => {
    const auth = Cookies.get("auth");
    if (auth) {
      const authData = JSON.parse(auth);
      const { accesstoken, admin } = authData;
      setToken(accesstoken.token);
      setAdminProfile(admin);
      setIsLogin(true);
    }
  }, []);

  useEffect(() => {
    if (token) {
      setIsLogin(true);
    }
  }, [token]);

  const saveToken = (newToken: string) => {
    setToken(newToken);
    Cookies.set("auth", JSON.stringify({ accesstoken: { token: newToken }, admin: adminProfile }), {
      expires: 30, // 30 days
    });
  };

  const saveAdminProfile = (admin: AdminType) => {
    setAdminProfile(admin);
    Cookies.set("auth", JSON.stringify({ accesstoken: { token }, admin }), {
      expires: 30, // 30 days
    });
  };

  return (
    <AuthContext.Provider value={{ token, isLogin, setToken: saveToken, setAdminProfile: saveAdminProfile, adminProfile }}>
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
