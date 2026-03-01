import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuthStore } from '@/stores/authStore';
import { useKeyStore } from '@/stores/keyStore';
import { useSecretsStore } from '@/stores/secretsStore';
import { getCurrentUserKeys, deletePublicKeyForUser } from '@/services/api/user.api';
import { clearAllKeys } from '@/services/crypto/keyStorage';

interface UseProfileMenuReturn {
  isLoading: boolean;
  error: string | null;
  handlePurgeAndSignOut: () => Promise<void>;
  handleSignOut: () => Promise<void>;
}

/**
 * Hook for managing profile menu actions including purge and sign-out
 */
export function useProfileMenu(): UseProfileMenuReturn {
  const { logout: auth0Logout } = useAuth0();
  const { auth0User } = useAuthStore();
  const authStoreLogout = useAuthStore((state) => state.logout);
  const clearCurrentKey = useKeyStore((state) => state.clearCurrentKey);
  const clearSecrets = useSecretsStore((state) => state.clearSecrets);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Purge all user data (local and remote keys) and sign out
   */
  const handlePurgeAndSignOut = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Delete all remote keys
      try {
        const keysResponse = await getCurrentUserKeys();
        if (keysResponse.keys && keysResponse.keys.length > 0) {
          // Delete each key from server
          await Promise.all(
            keysResponse.keys.map((key) =>
              deletePublicKeyForUser(auth0User?.sub || '', key.id)
            )
          );
        }
      } catch (keyError) {
        console.warn('Failed to delete remote keys:', keyError);
        // Continue with local cleanup even if remote deletion fails
      }

      // Step 2: Clear all local data
      clearAllKeys(); // Delete all localStorage keys
      authStoreLogout();
      clearCurrentKey();
      clearSecrets();

      // Step 3: Logout from Auth0
      await auth0Logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to purge account';
      setError(errorMsg);
      console.error('Purge and sign out failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Sign out without purging keys
   */
  const handleSignOut = async () => {
    setIsLoading(true);

    try {
      authStoreLogout();
      clearCurrentKey();
      clearSecrets();

      await auth0Logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      });
    } catch (err) {
      console.error('Sign out failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    handlePurgeAndSignOut,
    handleSignOut,
  };
}
