import { useEffect } from 'react';
import { useSecretsStore } from '@/stores/secretsStore';
import { usePigeonHoleAuth } from './usePigeonHoleAuth';

/**
 * Hook for managing secrets (fetch, delete, etc.)
 */
export function useSecrets(autoFetch: boolean = true) {
  const {
    receivedSecrets,
    isLoading,
    error,
    fetchReceivedSecrets,
    deleteSecret,
    deleteAllSecrets,
    clearSecrets,
    setError,
  } = useSecretsStore();

  const { isAuthenticated, auth0Token } = usePigeonHoleAuth();

  // Auto-fetch secrets when authenticated
  useEffect(() => {
    if (autoFetch && isAuthenticated && auth0Token && receivedSecrets.length === 0) {
      fetchReceivedSecrets();
    }
  }, [autoFetch, isAuthenticated, auth0Token, receivedSecrets.length, fetchReceivedSecrets]);

  const refresh = async () => {
    if (!isAuthenticated || !auth0Token) {
      return;
    }
    await fetchReceivedSecrets();
  };

  return {
    secrets: receivedSecrets,
    isLoading,
    error,
    fetchSecrets: fetchReceivedSecrets,
    deleteSecret,
    deleteAllSecrets,
    clearSecrets,
    setError,
    refresh,
  };
}
