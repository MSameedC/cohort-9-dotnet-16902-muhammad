import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Check if the JWT token exists in localStorage (similar to checking a session/auth token)
    const token = localStorage.getItem('token');

    if (!token) {
        // If no token is found, redirect them to the login page
        return <Navigate to="/login" replace />;
    }

    // If authenticated, render the protected component (like your Dashboard)
    return children;
};

export default ProtectedRoute;