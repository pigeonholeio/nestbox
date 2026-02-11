import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useAuthStore } from '@/stores/authStore';
import { hasStoredKey } from '@/stores/keyStore';

/**
 * Auth0 callback handler component
 * Sets Auth0 token and redirects to appropriate page
 */
export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const { setAuth0State, auth0Token } = useAuthStore();
  const [error, setError] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  useEffect(() => {
    const handleCallback = async () => {
      if (isLoading || !isAuthenticated || !user || isProcessing) {
        return;
      }

      // If we already have a token, skip
      if (auth0Token) {
        const userHasKey = hasStoredKey(user.email || '');
        navigate(userHasKey ? '/send' : '/onboarding', { replace: true });
        return;
      }

      setIsProcessing(true);

      try {
        // Get Auth0 access token
        const token = await getAccessTokenSilently();

        // Set Auth0 state
        setAuth0State(
          {
            email: user.email || '',
            name: user.name || '',
            sub: user.sub || '',
            email_verified: user.email_verified || false,
            picture: user.picture,
          },
          token
        );

        // Check if user has keys
        const userHasKey = hasStoredKey(user.email || '');

        // Navigate to appropriate page
        navigate(userHasKey ? '/send' : '/onboarding', { replace: true });
      } catch (err) {
        console.error('Authentication failed:', err);
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to authenticate. Please try again.'
        );
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [
    isLoading,
    isAuthenticated,
    user,
    getAccessTokenSilently,
    setAuth0State,
    navigate,
    auth0Token,
    isProcessing,
  ]);

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
        }}
      >
        <Typography variant="h5" color="error">
          Authentication Error
        </Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" maxWidth={400}>
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
      }}
    >
      <CircularProgress size={60} />
      <Typography variant="h6" color="text.secondary">
        Signing you in...
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Please wait while we set up your secure session
      </Typography>
    </Box>
  );
};
