import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'member' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, role, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to appropriate login page based on required role
    const loginPath = requiredRole === 'admin' ? '/admin/login' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Special handling for userType 3 - they can access both roles but only from their login source
    if (user?.userType === 3) {
      // userType 3 can only access admin routes if they logged in from admin login
      if (requiredRole === 'admin' && user.loginSource !== 'admin') {
        return <Navigate to="/dashboard" replace />;
      }
      // userType 3 can only access member routes if they logged in from member login
      if (requiredRole === 'member' && user.loginSource !== 'member') {
        return <Navigate to="/admin/dashboard" replace />;
      }
    } else {
      // Regular users - redirect to appropriate dashboard if role doesn't match
      if (role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      } else {
        return <Navigate to="/dashboard" replace />;
      }
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
