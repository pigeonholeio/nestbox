import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, CircularProgress } from '@mui/material';
import { useAuthStore } from '@/stores/authStore';
import { useKeyManagement } from '@/hooks/useKeyManagement';

interface OnboardingRouteProps {
  children: React.ReactNode;
}

/**
 * Route that handles onboarding flow intelligently:
 * - Not authenticated → redirect to /
 * - Authenticated with key → redirect to /vault
 * - Authenticated without key → show onboarding
 * - Page reload → automatically routes based on auth + key status
 */
export const OnboardingRoute: React.FC<OnboardingRouteProps> = ({
  children,
}) => {
  const location = useLocation();
  const { isAuthenticated, isLoading: auth0Loading } = useAuth0();
  const { auth0Token } = useAuthStore();
  const { hasKey } = useKeyManagement();

  // Show loading while checking auth
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

  // Not authenticated → redirect to landing
  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Authenticated but no token yet → redirect to callback
  if (isAuthenticated && !auth0Token) {
    return <Navigate to="/callback" replace />;
  }

  // Authenticated with key already → skip onboarding
  if (hasKey) {
    return <Navigate to="/vault" replace />;
  }

  // Authenticated without key → show onboarding
  return <>{children}</>;
};
