import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Private Route Component
export const PrivateRoute = () => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    // If not authenticated, redirect to login
    // Otherwise, render the child routes
    return isAuthenticated() ? <Outlet /> : <Navigate to="/authentication" replace state={{from: location}}/>;
};