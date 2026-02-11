import { create } from 'zustand';
import type { StoredKeyData } from '@/types/crypto.types';
import {
  storeKey,
  loadStoredKey,
  hasStoredKey as checkStoredKey,
} from '@/services/crypto/keyStorage';
import { initializeUserKeys } from '@/services/crypto/keyGeneration';
import { uploadPublicKey } from '@/services/api/user.api';

interface KeyState {
  currentKey: StoredKeyData | null;
  hasKey: boolean;
  isGenerating: boolean;
  generationProgress: number;
  error: string | null;

  // Actions
  loadKey: (email: string) => void;
  generateAndStoreKey: (
    userName: string,
    userEmail: string,
    apiToken: string
  ) => Promise<void>;
  clearCurrentKey: () => void;
  setGenerationProgress: (progress: number) => void;
}

export const useKeyStore = create<KeyState>((set) => ({
  // Initial state
  currentKey: null,
  hasKey: false,
  isGenerating: false,
  generationProgress: 0,
  error: null,

  // Load key for a specific user
  loadKey: (email) => {
    const keyData = loadStoredKey(email);
    set({
      currentKey: keyData,
      hasKey: keyData !== null,
    });
  },

  // Generate new key and upload to server
  generateAndStoreKey: async (userName, userEmail, _apiToken) => {
    set({ isGenerating: true, generationProgress: 0, error: null });

    try {
      // Generate and encrypt key
      const keyData = await initializeUserKeys(
        userName,
        userEmail,
        (progress) => {
          set({ generationProgress: progress });
        }
      );

      // Store in localStorage
      storeKey(userEmail, keyData);

      // Upload public key to server
      await uploadPublicKey(keyData.publicKey, keyData.thumbprint, userEmail);

      set({
        currentKey: keyData,
        hasKey: true,
        isGenerating: false,
        generationProgress: 100,
      });
    } catch (error) {
      console.error('Key generation failed:', error);
      set({
        isGenerating: false,
        error: error instanceof Error ? error.message : 'Key generation failed',
      });
      throw error;
    }
  },

  // Clear current key from memory (not from localStorage)
  clearCurrentKey: () => {
    set({
      currentKey: null,
      hasKey: false,
      generationProgress: 0,
    });
  },

  // Set generation progress
  setGenerationProgress: (progress) => {
    set({ generationProgress: progress });
  },
}));

// Helper function to check if user has a stored key
export function hasStoredKey(email: string): boolean {
  return checkStoredKey(email);
}
