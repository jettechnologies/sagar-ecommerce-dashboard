import { useEffect } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/authContext';

const ProtectedRoutes = () => {
  const { token, isLogin, loading } = useAuth();
  const navigate = useNavigate(); // Get the navigate function from react-router-dom

  useEffect(() => {
    const handleViewportCheck = () => {
      if (window.innerWidth < 1024) {
        // Redirect internally using Navigate component
        navigate('/viewport-warning', { replace: true });
      }
    };

    handleViewportCheck();

    // Clean-up if necessary
    return () => {
      // Cleanup logic if needed
    };
  }, [navigate]); // Include navigate in the dependency array to prevent stale closures

  if (token && isLogin && !loading) {
    return <Outlet />;
  } else if (!loading && !(token && isLogin)) {
    return <Navigate to="/login" replace />;
  } else {
    return null; // or loading indicator or any default content
  }
};

export default ProtectedRoutes;
