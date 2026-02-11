import React from 'react';
import { Box, Container, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useUIStore } from '@/stores/uiStore';

interface AppLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showHeader?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  title?: string;
  showSearchBar?: boolean;
  onSearchClick?: () => void;
}

/**
 * Main application layout with header, sidebar, and content area
 */
export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  showSidebar = false,
  showHeader = true,
  maxWidth = false,
  title,
  showSearchBar,
  onSearchClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const handleMenuClick = () => {
    toggleSidebar();
  };

  // Show menu button on mobile when sidebar is available
  const shouldShowMenuButton = isMobile && showSidebar;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {showHeader && (
        <Header
          title={title}
          showMenuButton={shouldShowMenuButton}
          onMenuClick={handleMenuClick}
          showSearchBar={showSearchBar}
          onSearchClick={onSearchClick}
        />
      )}

      {showSidebar && <Sidebar />}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          minHeight: '100vh',
          width: '100%',
        }}
      >
        {showHeader && <Toolbar />}

        <Container
          maxWidth={maxWidth}
          sx={{
            py: 4,
            px: { xs: 2, sm: 3 },
          }}
        >
          {children}
        </Container>
      </Box>
    </Box>
  );
};
