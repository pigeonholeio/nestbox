import { create } from 'zustand';
import type { FriendlyError } from '@/types/user.types';
import { STORAGE_KEYS } from '@/config/constants';

type ThemeMode = 'light' | 'dark';

interface UIState {
  theme: ThemeMode;
  sidebarOpen: boolean;
  error: FriendlyError | null;
  successMessage: string | null;

  // Actions
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setError: (error: FriendlyError) => void;
  clearError: () => void;
  setSuccess: (message: string) => void;
  clearSuccess: () => void;
}

// Load theme from localStorage
const loadTheme = (): ThemeMode => {
  const stored = localStorage.getItem(STORAGE_KEYS.THEME);
  return (stored === 'dark' ? 'dark' : 'light') as ThemeMode;
};

// Save theme to localStorage
const saveTheme = (theme: ThemeMode): void => {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
};

export const useUIStore = create<UIState>((set) => ({
  // Initial state
  theme: loadTheme(),
  sidebarOpen: true,
  error: null,
  successMessage: null,

  // Toggle theme between light and dark
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      saveTheme(newTheme);
      return { theme: newTheme };
    });
  },

  // Set theme explicitly
  setTheme: (theme) => {
    saveTheme(theme);
    set({ theme });
  },

  // Toggle sidebar
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  // Set sidebar open state
  setSidebarOpen: (open) => {
    set({ sidebarOpen: open });
  },

  // Set error
  setError: (error) => {
    set({ error });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Set success message
  setSuccess: (message) => {
    set({ successMessage: message });
  },

  // Clear success message
  clearSuccess: () => {
    set({ successMessage: null });
  },
}));
