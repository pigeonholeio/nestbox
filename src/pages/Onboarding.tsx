import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Button } from '@mui/material';
import { KeyGenerationModal } from '@/components/Crypto/KeyGenerationModal';
import { KeyWarningDialog } from '@/components/Crypto/KeyWarningDialog';
import { useKeyManagement } from '@/hooks/useKeyManagement';
import { usePigeonHoleAuth } from '@/hooks/usePigeonHoleAuth';
import { LoadingSpinner } from '@/components/Common/LoadingSpinner';

/**
 * Onboarding page for first-time users
 * Handles key generation with warnings
 */
export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, user } = usePigeonHoleAuth();
  const {
    hasKey,
    generationProgress,
    error: keyError,
    generateKey,
    checkHasKey,
  } = useKeyManagement();

  const [showWarning, setShowWarning] = useState(false);
  const [showGenerationModal, setShowGenerationModal] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Check if user already has a key
  useEffect(() => {
    if (user?.email) {
      const userAlreadyHasKey = checkHasKey(user.email);
      if (userAlreadyHasKey && !showWarning) {
        // Show the "key ready" dialog if not already showing
        setShowWarning(true);
      }
    }
  }, [user?.email, checkHasKey]);

  // Show warning dialog on mount
  useEffect(() => {
    if (isAuthenticated && !authLoading && !hasKey) {
      setShowWarning(true);
    }
  }, [isAuthenticated, authLoading, hasKey]);

  // Handle warning acceptance
  const handleAcceptWarning = async () => {
    setShowWarning(false);

    // If user already has a key, just navigate to app
    if (hasKey) {
      navigate('/send', { replace: true });
      return;
    }

    // Otherwise start key generation
    setShowGenerationModal(true);

    try {
      await generateKey();
      setIsComplete(true);

      // Navigate to send page after a brief delay
      setTimeout(() => {
        navigate('/send', { replace: true });
      }, 2000);
    } catch (error) {
      console.error('Key generation failed:', error);
      // Modal will show the error
    }
  };

  // Handle warning cancellation (logout)
  const handleCancelWarning = () => {
    setShowWarning(false);
    navigate('/', { replace: true });
  };

  // Handle retry if generation fails
  const handleRetry = async () => {
    setShowGenerationModal(true);
    setIsComplete(false);

    try {
      await generateKey();
      setIsComplete(true);

      setTimeout(() => {
        navigate('/send', { replace: true });
      }, 2000);
    } catch (error) {
      console.error('Key generation retry failed:', error);
    }
  };

  if (authLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
        }}
      >
        {keyError && !showGenerationModal && (
          <Box sx={{ textAlign: 'center' }}>
            <Button variant="contained" onClick={handleRetry} size="large">
              Retry Key Generation
            </Button>
          </Box>
        )}

        <KeyWarningDialog
          open={showWarning}
          onAccept={handleAcceptWarning}
          onCancel={handleCancelWarning}
          userHasKey={hasKey}
        />

        <KeyGenerationModal
          open={showGenerationModal}
          progress={generationProgress}
          isComplete={isComplete}
          error={keyError}
        />
      </Box>
    </Container>
  );
};
