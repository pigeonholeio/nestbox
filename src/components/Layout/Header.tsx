import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, TextField, InputAdornment } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { ThemeToggle } from './ThemeToggle';
import { LogoutButton } from '@/components/Auth/LogoutButton';
import { useAuthStore } from '@/stores/authStore';

interface HeaderProps {
  title?: string;
  showMenuButton?: boolean;
  onMenuClick?: () => void;
  showSearchBar?: boolean;
  onSearchClick?: () => void;
}

/**
 * Top header component with logo, navigation, and user actions
 */
export const Header: React.FC<HeaderProps> = ({
  title = 'PigeonHole',
  showMenuButton,
  onMenuClick,
  showSearchBar,
  onSearchClick,
}) => {
  const auth0User = useAuthStore((state) => state.auth0User);

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: 'background.paper',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ gap: 3 }}>
        {/* Left: Menu Button (if sidebar is hidden) */}
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

        {/* Logo and App Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            component="img"
            src="/logo.png"
            alt="PigeonHole Logo"
            sx={{
              height: 32,
              width: 'auto',
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
            }}
          >
            {title}
          </Typography>
        </Box>

        {/* Center: Search Bar */}
        {auth0User && (
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', mx: 2 }}>
            <TextField
              placeholder="Search secrets..."
              onClick={onSearchClick}
              readOnly
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: { xs: '100%', sm: 400 },
                cursor: 'pointer',
              }}
            />
          </Box>
        )}

        {/* Right: Theme + User + Logout */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 'auto' }}>
          <ThemeToggle />

          {auth0User && (
            <>
              <Typography
                variant="body2"
                sx={{
                  display: { xs: 'none', md: 'block' },
                  color: 'text.secondary',
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
