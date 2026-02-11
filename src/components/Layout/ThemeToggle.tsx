import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useUIStore } from '@/stores/uiStore';

interface ThemeToggleProps {
  size?: 'small' | 'medium' | 'large';
}

/**
 * Theme toggle button to switch between light and dark modes
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 'medium' }) => {
  const { theme, toggleTheme } = useUIStore();

  return (
    <Tooltip title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} arrow>
      <IconButton
        onClick={toggleTheme}
        color="inherit"
        size={size}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>
    </Tooltip>
  );
};
