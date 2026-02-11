import { useEffect } from 'react';
import { useKeyStore, hasStoredKey } from '@/stores/keyStore';
import { useAuthStore } from '@/stores/authStore';

/**
 * Hook for managing user encryption keys
 */
export function useKeyManagement() {
  const {
    currentKey,
    hasKey,
    isGenerating,
    generationProgress,
    error,
    loadKey,
    generateAndStoreKey,
    clearCurrentKey,
  } = useKeyStore();

  const { auth0User, auth0Token } = useAuthStore();

  // Load key when user changes
  useEffect(() => {
    if (auth0User?.email) {
      loadKey(auth0User.email);
    }
  }, [auth0User?.email, loadKey]);

  const generateKey = async () => {
    if (!auth0User || !auth0Token) {
      throw new Error('User must be authenticated to generate keys');
    }

    await generateAndStoreKey(
      auth0User.name,
      auth0User.email,
      auth0Token
    );
  };

  const checkHasKey = (email?: string): boolean => {
    const emailToCheck = email || auth0User?.email;
    if (!emailToCheck) return false;
    return hasStoredKey(emailToCheck);
  };

  return {
    currentKey,
    hasKey,
    isGenerating,
    generationProgress,
    error,
    generateKey,
    clearCurrentKey,
    checkHasKey,
  };
}
