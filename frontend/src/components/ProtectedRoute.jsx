/**
 * Protected Route Component
 * ---------------------------
 * Wraps routes that require authentication and optionally
 * restricts access to specific roles.
 *
 * Usage:
 *   <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
 */

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

export default function ProtectedRoute({ allowedRoles }) {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) return <Spinner />;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
