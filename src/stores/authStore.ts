import { create } from 'zustand';
import type { Auth0User } from '@/types/user.types';
import { setAuthToken } from '@/services/api/client';

interface AuthState {
  // Auth0
  isAuth0Authenticated: boolean;
  auth0User: Auth0User | null;
  auth0Token: string | null;

  // Actions
  setAuth0State: (user: Auth0User, token: string) => void;
  logout: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Initial state
  isAuth0Authenticated: false,
  auth0User: null,
  auth0Token: null,

  // Set Auth0 authentication state and token
  setAuth0State: (user, token) => {
    setAuthToken(token);
    set({
      isAuth0Authenticated: true,
      auth0User: user,
      auth0Token: token,
    });
  },

  // Logout
  logout: () => {
    setAuthToken(null);
    set({
      isAuth0Authenticated: false,
      auth0User: null,
      auth0Token: null,
    });
  },

  // Clear auth state
  clearAuth: () => {
    setAuthToken(null);
    set({
      isAuth0Authenticated: false,
      auth0User: null,
      auth0Token: null,
    });
  },
}));
