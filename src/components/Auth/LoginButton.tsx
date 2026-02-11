import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, CircularProgress } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';

interface LoginButtonProps {
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  children?: React.ReactNode;
}

/**
 * Auth0 login button component
 */
export const LoginButton: React.FC<LoginButtonProps> = ({
  variant = 'contained',
  size = 'large',
  fullWidth = false,
  children = 'Sign In',
}) => {
  const { loginWithRedirect, isLoading } = useAuth0();

  const handleLogin = async () => {
    try {
      await loginWithRedirect({
        appState: {
          returnTo: window.location.pathname,
        },
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      onClick={handleLogin}
      disabled={isLoading}
      startIcon={isLoading ? <CircularProgress size={20} /> : <LoginIcon />}
      aria-label="Sign in with Auth0"
    >
      {children}
    </Button>
  );
};
