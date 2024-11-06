// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ redirectPath = '/login' }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to={redirectPath} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
