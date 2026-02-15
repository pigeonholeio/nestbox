import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuthStore } from '@/stores/authStore';
import { setRefreshTokenCallback } from '@/services/api/client';
import { useKeyManagement } from './useKeyManagement';

/**
 * Hook to handle PigeonHole authentication flow
 * Manages Auth0 token and refresh
 */
export function usePigeonHoleAuth() {
  const { isAuthenticated, isLoading, user, getAccessTokenSilently } = useAuth0();
  const { auth0Token, auth0User, setAuth0State } = useAuthStore();
  const { validateAndSyncKeys } = useKeyManagement();

  useEffect(() => {
    const initializeAuth = async () => {
      if (!isAuthenticated || !user || auth0Token) {
        return;
      }

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

        // Sync keys with remote API after successful auth
        try {
          await validateAndSyncKeys();
        } catch (syncError) {
          console.error('Key sync failed during auth:', syncError);
          // Non-blocking - don't fail auth if sync fails
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      }
    };

    initializeAuth();
  }, [isAuthenticated, user, auth0Token, getAccessTokenSilently, setAuth0State, validateAndSyncKeys]);

  // Setup token refresh callback
  useEffect(() => {
    setRefreshTokenCallback(async () => {
      try {
        return await getAccessTokenSilently();
      } catch (error) {
        console.error('Token refresh failed:', error);
        return null;
      }
    });
  }, [getAccessTokenSilently]);

  return {
    isAuthenticated,
    isLoading,
    user: auth0User,
    auth0Token,
    auth0User,
  };
}
