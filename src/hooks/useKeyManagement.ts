import { useEffect } from 'react';
import { useKeyStore, hasStoredKey } from '@/stores/keyStore';
import { useAuthStore } from '@/stores/authStore';
import { getCurrentUserKeys } from '@/services/api/user.api';

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

  const validateAndSyncKeys = async (): Promise<void> => {
    if (!auth0User || !auth0Token) {
      throw new Error('User must be authenticated to sync keys');
    }

    try {
      // Get remote keys from API
      const remoteKeysResponse = await getCurrentUserKeys();
      const remoteKeys = remoteKeysResponse.keys || [];
      const localThumbprint = currentKey?.thumbprint;

      // Check if local key matches any remote key
      const hasMatchingRemoteKey = localThumbprint && remoteKeys.some(
        (k) => k.thumbprint === localThumbprint
      );

      // If no matching key found or no remote keys exist, generate and upload new key
      if (!hasMatchingRemoteKey) {
        await generateKey();
      }
    } catch (err) {
      console.error('Key sync failed:', err);
      // Fallback: generate new key if sync fails
      await generateKey();
    }
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
    validateAndSyncKeys,
  };
}
