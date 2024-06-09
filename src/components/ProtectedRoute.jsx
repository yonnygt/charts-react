// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (user === null) {
    // Mientras se carga el estado de autenticación, podemos mostrar un loader
    return <div>Loading...</div>;
  }
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
