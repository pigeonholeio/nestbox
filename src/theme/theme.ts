import { createTheme, Theme } from '@mui/material/styles';

// Plane Sailing Design System - Dark Theme with Violet Accent
export const darkTheme: Theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#a78bfa',      // Violet - PigeonHole accent per Plane Sailing spec
      light: '#c4b5fd',     // Lighter violet
      dark: '#8b5cf6',      // Darker violet
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
    } as Record<string, string>,
    secondary: {
      main: '#10b981',      // Green for secondary actions
      light: '#34d399',
      dark: '#059669',
    },
    background: {
      default: '#07090d',   // Near-black background
      paper: '#0b0e14',     // Slightly lighter for cards/surfaces
    },
    text: {
      primary: '#dde6f0',   // Light text
      secondary: '#6b7f96', // Muted text
      disabled: '#475569',  // Disabled text
    },
    divider: 'rgba(167, 139, 250, 0.1)',
    error: {
      main: '#ef4444',
      light: '#fca5a5',
      dark: '#dc2626',
    },
    success: {
      main: '#10b981',
      light: '#6ee7b7',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b',
      light: '#fcd34d',
      dark: '#d97706',
    },
    info: {
      main: '#06b6d4',
      light: '#22d3ee',
      dark: '#0891b2',
    },
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontFamily: 'Syne, sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: 'Syne, sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: 'Syne, sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: 'Syne, sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: 'Syne, sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: 'JetBrains Mono, monospace',
      fontWeight: 600,
      fontSize: '0.875rem',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
    body1: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      fontFamily: 'Syne, sans-serif',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    caption: {
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '0.68rem',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#07090d',
          color: '#dde6f0',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          fontWeight: 600,
          letterSpacing: '0.05em',
          transition: 'all 0.2s ease',
          borderRadius: '10px',
        },
        contained: {
          backgroundColor: '#a78bfa',
          color: '#07090d',
          '&:hover': {
            backgroundColor: '#c4b5fd',
            boxShadow: '0 0 20px rgba(167, 139, 250, 0.3)',
          },
        },
        outlined: {
          borderColor: 'rgba(167, 139, 250, 0.3)',
          color: '#a78bfa',
          '&:hover': {
            borderColor: '#a78bfa',
            backgroundColor: 'rgba(167, 139, 250, 0.08)',
          },
        },
        text: {
          color: '#a78bfa',
          '&:hover': {
            backgroundColor: 'rgba(167, 139, 250, 0.08)',
          },
        },
      },
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#0b0e14',
          borderRadius: '10px',
          border: '1px solid rgba(167, 139, 250, 0.1)',
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#0b0e14',
          backgroundImage: 'none',
          borderColor: 'rgba(167, 139, 250, 0.1)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            '& fieldset': {
              borderColor: 'rgba(167, 139, 250, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(167, 139, 250, 0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#a78bfa',
              boxShadow: '0 0 0 3px rgba(167, 139, 250, 0.1)',
            },
          },
          '& .MuiOutlinedInput-input': {
            color: '#dde6f0',
            '&::placeholder': {
              color: '#6b7f96',
              opacity: 1,
            },
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: '#dde6f0',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(167, 139, 250, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(167, 139, 250, 0.1)',
          color: '#a78bfa',
          borderColor: 'rgba(167, 139, 250, 0.2)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          border: '1px solid',
        },
        standardError: {
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          borderColor: 'rgba(239, 68, 68, 0.3)',
          color: '#fca5a5',
        },
        standardWarning: {
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          borderColor: 'rgba(245, 158, 11, 0.3)',
          color: '#fcd34d',
        },
        standardInfo: {
          backgroundColor: 'rgba(6, 182, 212, 0.1)',
          borderColor: 'rgba(6, 182, 212, 0.3)',
          color: '#22d3ee',
        },
        standardSuccess: {
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          borderColor: 'rgba(16, 185, 129, 0.3)',
          color: '#6ee7b7',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0b0e14',
          borderColor: 'rgba(167, 139, 250, 0.1)',
          border: '1px solid rgba(167, 139, 250, 0.1)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#0b0e14',
          borderColor: 'rgba(167, 139, 250, 0.1)',
          border: '1px solid rgba(167, 139, 250, 0.1)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#a78bfa',
          '&:hover': {
            backgroundColor: 'rgba(167, 139, 250, 0.1)',
          },
        },
      },
    },
  },
});

// Export darkTheme as default for backwards compatibility
export const lightTheme = darkTheme;
