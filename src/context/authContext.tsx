// import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
// import Cookies from 'js-cookie';
// // import { AdminType } from '@/types';

// // Define the shape of the context state
// interface AuthState {
//   token: string;
//   isLogin: boolean;
//   loading: boolean;
//   // adminProfile: AdminType | null;
// }

// // Define the shape of the context methods
// interface AuthContextProps extends AuthState {
//   setToken: (token: string) => void;
//   // setAdminProfile: (adminProfile: AdminType) => void;
// }

// // Create the context with default values
// const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// // AuthProvider component to wrap around components that need access to the context
// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [token, setToken] = useState<string>('');
//   const [isLogin, setIsLogin] = useState<boolean>(false);
//   const [loading, setLoading] = useState(true);
//   // const [adminProfile, setAdminProfile] = useState<AdminType | null>(null);

//   useEffect(() => {
//     const auth_token = Cookies.get("auth_token");
//     const t = auth_token || "";
//     if (t !== "") {
//       setToken(t);
//     }
//     setLoading(false)
//   }, []);

//   useEffect(() => {
//     if (token && token !== "") {
//       setIsLogin(true);
//     }
//   }, [token]);

//   console.log(token, isLogin);


//   // const saveToken = (newToken: string) => {
//   //   setToken(newToken);
//   //   Cookies.set("auth", JSON.stringify({ accesstoken: { token: newToken }, admin: adminProfile }), {
//   //     expires: 30, // 30 days
//   //   });
//   // };

//   // const saveAdminProfile = (admin: AdminType) => {
//   //   setAdminProfile(admin);
//   //   Cookies.set("auth", JSON.stringify({ accesstoken: { token }, admin }), {
//   //     expires: 30, // 30 days
//   //   });
//   // };

//   return (
//     <AuthContext.Provider value={{ token, isLogin, setToken, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook to use the AuthContext
// export const useAuth = (): AuthContextProps => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };


import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';

// Define the shape of the context state
interface AuthState {
  token: string;
  isLogin: boolean;
  loading: boolean;
  // adminProfile: AdminType | null;
}

// Define the shape of the context methods
interface AuthContextProps extends AuthState {
  setToken: (token: string) => void;
  // setAdminProfile: (adminProfile: AdminType) => void;
}

// Create the context with default values
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// AuthProvider component to wrap around components that need access to the context
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string>("");
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  // const [adminProfile, setAdminProfile] = useState<AdminType | null>(null);

  useEffect(() => {
    const auth_token = Cookies.get("auth_token");
    console.log(auth_token)
    const t = auth_token || "";
    console.log(t)
    if (t !== "") {
      setToken(t);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token !== "" || token) {
      setIsLogin(true);
    }
  }, [token]);

  console.log(token, isLogin);

  return (
    <AuthContext.Provider value={{ token, isLogin, setToken, loading }}>
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
