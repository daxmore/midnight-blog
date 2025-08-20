import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return currentUser && currentUser.role === 'admin' ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default AdminRoute;
