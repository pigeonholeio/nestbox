import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, TextField, InputAdornment, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import { ThemeToggle } from './ThemeToggle';
import { LogoutButton } from '@/components/Auth/LogoutButton';
import { useAuthStore } from '@/stores/authStore';

interface HeaderProps {
  title?: string;
  showMenuButton?: boolean;
  onMenuClick?: () => void;
  showSearchBar?: boolean;
  onSearchClick?: () => void;
  onSendClick?: () => void;
}

/**
 * Top header component with logo, navigation, and user actions
 */
export const Header: React.FC<HeaderProps> = ({
  showMenuButton,
  onMenuClick,
  onSearchClick,
  onSendClick,
}) => {
  const auth0User = useAuthStore((state) => state.auth0User);

  return (
    <AppBar
      position="relative"
      elevation={1}
      sx={{
        bgcolor: 'background.paper',
        color: 'text.primary',
        width: '100%',
      }}
    >
      <Toolbar sx={{ gap: 2, justifyContent: 'space-between' }}>
        {/* Left: Menu Button + Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 0 }}>
          {showMenuButton && (
            <IconButton
              color="inherit"
              aria-label="open menu"
              onClick={onMenuClick}
              size="large"
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <Box
              component="img"
              src="/logo.png"
              alt="PigeonHole Logo"
              sx={{
                height: 32,
                width: 'auto',
                flexShrink: 0,
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <Typography
              variant="h6"
              component="h1"
              sx={{
                fontWeight: 600,
                color: 'primary.main',
                display: { xs: 'none', sm: 'block' },
                whiteSpace: 'nowrap',
              }}
            >
              PigeonHole [Beta]
            </Typography>
          </Box>
        </Box>

        {/* Center: Search Bar - Flexible Width */}
        {auth0User && (
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', mx: 2, minWidth: 0 }}>
            <TextField
              placeholder="Search secrets..."
              onClick={onSearchClick}
              variant="outlined"
              size="small"
              InputProps={{
                readOnly: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: '100%',
                maxWidth: 500,
                cursor: 'pointer',
              }}
            />
          </Box>
        )}

        {/* Right: Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flexShrink: 0 }}>
          {auth0User && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<SendIcon />}
              onClick={onSendClick}
              size="small"
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              Send Secret
            </Button>
          )}

          {auth0User && (
            <IconButton
              color="inherit"
              onClick={onSendClick}
              sx={{ display: { xs: 'flex', sm: 'none' } }}
              title="Send Secret"
            >
              <SendIcon />
            </IconButton>
          )}

          <ThemeToggle />

          {auth0User && (
            <>
              <Typography
                variant="body2"
                sx={{
                  display: { xs: 'none', lg: 'block' },
                  color: 'text.secondary',
              whiteSpace: 'nowrap',
                }}
              >
                {auth0User.email}
              </Typography>
              <LogoutButton />
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
