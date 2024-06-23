import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (user === null) {
    return <div>Loading...</div>;
  }
  return user.role === 'admin' ? children : <Navigate to="/dashboard" />;
};

export default AdminRoute;
