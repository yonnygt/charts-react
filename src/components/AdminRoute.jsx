import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (user === null) {
    return <div>Loading.</div>;
  }
  return user.role === 1 ? children : <Navigate to="/dashboard" />;
};

export default AdminRoute;
