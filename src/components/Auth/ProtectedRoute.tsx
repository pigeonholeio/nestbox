import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, CircularProgress } from '@mui/material';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Protected route wrapper that requires authentication
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
}) => {
  const location = useLocation();
  const { isAuthenticated, isLoading: auth0Loading } = useAuth0();
  const { auth0Token } = useAuthStore();

  // Show loading spinner while checking authentication
  if (auth0Loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Redirect to landing if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Redirect to callback if Auth0 is authenticated but no token yet
  if (isAuthenticated && !auth0Token) {
    return <Navigate to="/callback" replace />;
  }

  return <>{children}</>;
};
