import React, { useState } from 'react';
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import { useAuthStore } from '@/stores/authStore';
import { useProfileMenu } from '@/hooks/useProfileMenu';

/**
 * Profile menu button component with dropdown menu for user actions
 * Includes Sign Out and Purge & Sign Out options
 */
export const ProfileMenuButton: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);
  const { auth0User } = useAuthStore();
  const { isLoading, error, handlePurgeAndSignOut, handleSignOut } = useProfileMenu();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOutClick = async () => {
    handleMenuClose();
    await handleSignOut();
  };

  const handlePurgeClick = () => {
    setShowPurgeConfirm(true);
    handleMenuClose();
  };

  const handleConfirmPurge = async () => {
    setShowPurgeConfirm(false);
    await handlePurgeAndSignOut();
  };

  if (!auth0User) return null;

  return (
    <>
      <IconButton
        onClick={handleMenuOpen}
        color="inherit"
        size="medium"
        aria-label="user profile menu"
        title="Profile menu"
      >
        <PersonIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {/* User Info Section */}
        <Box sx={{ px: 2, py: 1.5, minWidth: 250 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {auth0User.name || auth0User.email}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {auth0User.email}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Sign Out */}
        <MenuItem onClick={handleSignOutClick} disabled={isLoading}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Sign Out</ListItemText>
        </MenuItem>

        {/* Purge & Sign Out */}
        <MenuItem onClick={handlePurgeClick} disabled={isLoading} sx={{ color: 'error.main' }}>
          <ListItemIcon sx={{ color: 'error.main' }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Purge & Sign Out</ListItemText>
        </MenuItem>
      </Menu>

      {/* Purge Confirmation Dialog */}
      <Dialog
        open={showPurgeConfirm}
        onClose={() => setShowPurgeConfirm(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" />
          Purge Account Data
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone. You will lose access to all your encrypted secrets.
          </Alert>

          <Typography variant="body2" color="text.secondary" paragraph>
            This will permanently delete:
          </Typography>

          <Box component="ul" sx={{ pl: 2, mb: 2 }}>
            <li>
              <Typography variant="body2">All your local encryption keys on this device</Typography>
            </li>
            <li>
              <Typography variant="body2">Your corrosponding remote public keys from the server</Typography>
            </li>
          </Box>

          <Typography variant="body2" color="text.secondary">
            You will be signed out and returned to the landing page.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowPurgeConfirm(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmPurge}
            variant="contained"
            color="error"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} /> : <DeleteIcon />}
          >
            {isLoading ? 'Purging...' : 'Purge & Sign Out'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
