import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
  Typography,
  Link,
  Divider,
} from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import HelpIcon from '@mui/icons-material/Help';
import { useUIStore } from '@/stores/uiStore';

const DRAWER_WIDTH = 240;

interface SidebarProps {
  variant?: 'permanent' | 'temporary';
}

/**
 * Navigation sidebar with app navigation and user info
 */
export const Sidebar: React.FC<SidebarProps> = ({ variant }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  // Auto close sidebar only when resizing from desktop to mobile
  React.useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile, setSidebarOpen]);

  const drawerVariant = variant || (isMobile ? 'temporary' : 'permanent');

  const menuItems = [
    { text: 'My PigeonHole', icon: <InboxIcon />, path: '/receive' },
    { text: 'My Keys', icon: <VpnKeyIcon />, path: '/keys' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const drawerContent = (
    <>
      <Box sx={{ overflow: 'auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path ? 'inherit' : 'text.secondary',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        {/* Footer Section */}
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', textAlign: 'center' }}>
          {/* Logo Image */}
          <Box
            component="img"
            src="https://pigeono.io/assets/images/landing_page.png"
            alt="PigeonHole"
            sx={{
              width: '100%',
              height: 'auto',
              mb: 2,
              borderRadius: 1,
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />

          <Divider sx={{ my: 1.5 }} />

          {/* Version Number */}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
            v{__APP_VERSION__} ({__COMMIT_HASH__})
          </Typography>

          {/* Help Contact */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
            <HelpIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">
              Need help?
            </Typography>
          </Box>

          <Link
            href="https://pigeono.io/about/contribute/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'block',
              fontSize: '0.75rem',
              color: 'primary.main',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Contact Support
          </Link>
        </Box>
      </Box>
    </>
  );

  // For permanent drawer, always show. For temporary, respect sidebarOpen state
  const isOpen = drawerVariant === 'permanent' || sidebarOpen;

  return (
    <Drawer
      variant={drawerVariant}
      open={isOpen}
      onClose={() => setSidebarOpen(false)}
      anchor="left"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          height: '100%',
          top: 0,
          position: 'relative',
        },
      }}
      ModalProps={{
        keepMounted: true, // Better mobile performance
        sx: {
          '& .MuiBackdrop-root': {
            position: 'fixed',
          },
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};
