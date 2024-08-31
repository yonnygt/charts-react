import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login            from './components/Login';
import Register         from './components/Register';
import Dashboard        from './components/Dashboard';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute   from './components/ProtectedRoute';
import Inventory        from './components/pages/Inventory';
import Analytics        from './components/pages/Analytics';
import Users            from './components/pages/Users'; 
import Roles            from './components/pages/Roles';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute><Dashboard /></ProtectedRoute>}>
          <Route path="/dashboard" element={<div className='dark:text-gray-50'>Bienvenido al Dashboard</div>} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/admin/users" element={
            <ProtectedRoute requiredRole={1}>
            <Users />
          </ProtectedRoute>} />
          <Route path="/admin/roles" element={
            <ProtectedRoute requiredRole={1}>
            <Roles />
          </ProtectedRoute>} />
        </Route>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/unauthorized" element={<div>No tienes permiso para acceder a esta página</div>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;