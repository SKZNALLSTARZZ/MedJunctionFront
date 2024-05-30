import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../customHooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, role } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/Unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
