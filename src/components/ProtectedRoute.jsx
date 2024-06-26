import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (user === null) {
    return <div>Loading...</div>;
  }
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
