import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
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
  onSendClick?: () => void;
}

/**
 * Main application layout with header, sidebar, and content area
 */
export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  showSidebar = false,
  showHeader = true,
  title,
  showSearchBar,
  onSearchClick,
  onSendClick,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { toggleSidebar } = useUIStore();

  const handleMenuClick = () => {
    toggleSidebar();
  };

  // Show menu button on mobile when sidebar is available
  const shouldShowMenuButton = isMobile && showSidebar;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      {/* Header */}
      {showHeader && (
        <Header
          title={title}
          showMenuButton={shouldShowMenuButton}
          onMenuClick={handleMenuClick}
          showSearchBar={showSearchBar}
          onSearchClick={onSearchClick}
          onSendClick={onSendClick}
        />
      )}

      {/* Sidebar and Content Row */}
      <Box sx={{ display: 'flex', flex: 1, width: '100%', minWidth: 0, overflow: 'hidden' }}>
        {/* Sidebar */}
        {showSidebar && <Sidebar />}

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flex: 1,
            width: '100%',
            overflow: 'auto',
            bgcolor: 'background.default',
            minWidth: 0,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
