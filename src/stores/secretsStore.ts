import { create } from 'zustand';
import type { Secret } from '@/types/api.types';
import {
  getReceivedSecrets,
  deleteSecret as apiDeleteSecret,
  deleteAllSecrets as apiDeleteAllSecrets,
} from '@/services/api/secret.api';

interface SecretsState {
  receivedSecrets: Secret[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchReceivedSecrets: () => Promise<void>;
  deleteSecret: (secretId: string) => Promise<void>;
  deleteAllSecrets: () => Promise<void>;
  clearSecrets: () => void;
  setError: (error: string | null) => void;
}

export const useSecretsStore = create<SecretsState>((set) => ({
  // Initial state
  receivedSecrets: [],
  isLoading: false,
  error: null,

  // Fetch received secrets
  fetchReceivedSecrets: async () => {
    set({ isLoading: true, error: null });
    try {
      const secrets = await getReceivedSecrets();
      set({
        receivedSecrets: secrets,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch secrets:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch secrets',
        isLoading: false,
      });
      throw error;
    }
  },

  // Delete a specific secret
  deleteSecret: async (secretId) => {
    try {
      await apiDeleteSecret(secretId);

      // Remove from local state
      set((state) => ({
        receivedSecrets: state.receivedSecrets.filter((s) => s.id !== secretId),
      }));
    } catch (error) {
      console.error('Failed to delete secret:', error);
      throw error;
    }
  },

  // Delete all secrets
  deleteAllSecrets: async () => {
    try {
      await apiDeleteAllSecrets();
      set({ receivedSecrets: [] });
    } catch (error) {
      console.error('Failed to delete all secrets:', error);
      throw error;
    }
  },

  // Clear secrets from state
  clearSecrets: () => {
    set({ receivedSecrets: [], error: null });
  },

  // Set error
  setError: (error) => {
    set({ error });
  },
}));
