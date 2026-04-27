// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute: React.FC = () => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <div className="loading">Завантаження...</div>; // або спінер
    }

    return currentUser ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;