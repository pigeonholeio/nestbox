import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { auth0Config } from '@/config/auth0.config';
import { useUIStore } from '@/stores/uiStore';
import { lightTheme, darkTheme } from '@/theme/theme';
import { ErrorBoundary } from '@/components/Common/ErrorBoundary';
import { ProtectedRoute } from '@/components/Auth/ProtectedRoute';
import { AuthCallback } from '@/components/Auth/AuthCallback';
import { Landing } from '@/pages/Landing';
import { Onboarding } from '@/pages/Onboarding';
import { SendSecret } from '@/pages/SendSecret';
import { ReceiveSecrets } from '@/pages/ReceiveSecrets';
import { MyKeys } from '@/pages/MyKeys';

/**
 * Main application component
 */
function App() {
  const theme = useUIStore((state) => state.theme);

  return (
    <ErrorBoundary>
      <Auth0Provider
        domain={auth0Config.domain}
        clientId={auth0Config.clientId}
        authorizationParams={auth0Config.authorizationParams}
        useRefreshTokens
        cacheLocation="localstorage"
      >
        <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
          <CssBaseline />
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/callback" element={<AuthCallback />} />

              {/* Protected routes */}
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/send"
                element={
                  <ProtectedRoute>
                    <SendSecret />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/receive"
                element={
                  <ProtectedRoute>
                    <ReceiveSecrets />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/keys"
                element={
                  <ProtectedRoute>
                    <MyKeys />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/receive" replace />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </Auth0Provider>
    </ErrorBoundary>
  );
}

export default App;
