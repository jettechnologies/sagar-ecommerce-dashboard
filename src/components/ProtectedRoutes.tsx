import { useEffect } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/authContext';

const ProtectedRoutes = () => {
  const { token, isLogin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleViewportCheck = () => {
      if (window.innerWidth < 1024) {
        navigate('/viewport-warning', { replace: true });
      }
    };

    handleViewportCheck();

  }, [navigate]); 

  if (token && isLogin && !loading) {
    return <Outlet />;
  } 
  else if (!loading && token === "" && isLogin) {
    return <Navigate to="/login" replace />;
  }
   else {
    return null;
  }
};

export default ProtectedRoutes;
