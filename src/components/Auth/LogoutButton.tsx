import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Button, CircularProgress } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthStore } from '@/stores/authStore';
import { useKeyStore } from '@/stores/keyStore';
import { useSecretsStore } from '@/stores/secretsStore';

interface LogoutButtonProps {
  variant?: 'text' | 'outlined' | 'contained';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  children?: React.ReactNode;
}

/**
 * Logout button component that clears Auth0 session and app state
 */
export const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = 'text',
  size = 'medium',
  fullWidth = false,
  children = 'Sign Out',
}) => {
  const { logout: auth0Logout, isLoading } = useAuth0();
  const authStoreLogout = useAuthStore((state) => state.logout);
  const clearCurrentKey = useKeyStore((state) => state.clearCurrentKey);
  const clearSecrets = useSecretsStore((state) => state.clearSecrets);

  const handleLogout = async () => {
    try {
      // Clear app state (but keep keys in localStorage)
      authStoreLogout();
      clearCurrentKey();
      clearSecrets();

      // Logout from Auth0
      await auth0Logout({
        logoutParams: {
          returnTo: window.location.origin,
        },
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      onClick={handleLogout}
      disabled={isLoading}
      startIcon={isLoading ? <CircularProgress size={20} /> : <LogoutIcon />}
      aria-label="Sign out"
    >
      {children}
    </Button>
  );
};
