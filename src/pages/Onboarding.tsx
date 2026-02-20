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
  const { isAuthenticated, isLoading: authLoading } = usePigeonHoleAuth();
  const {
    hasKey,
    generationProgress,
    error: keyError,
    generateKey,
  } = useKeyManagement();

  const [showWarning, setShowWarning] = useState(false);
  const [showGenerationModal, setShowGenerationModal] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Auto-navigate to /receive when keys are synced by usePigeonHoleAuth
  useEffect(() => {
    if (isAuthenticated && !authLoading && hasKey) {
      navigate('/vault', { replace: true });
    }
  }, [isAuthenticated, authLoading, hasKey, navigate]);

  // Show warning dialog when user first logs in without local keys
  // This is a deliberate pattern for showing onboarding warnings on first login
  useEffect(() => {
    if (isAuthenticated && !authLoading && !hasKey && !showWarning) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowWarning(true);
    }
  }, [isAuthenticated, authLoading, hasKey, showWarning]);

  // Handle warning acceptance
  const handleAcceptWarning = async () => {
    setShowWarning(false);

    // If user already has a key, navigate to receive
    if (hasKey) {
      navigate('/vault', { replace: true });
      return;
    }

    // Show generation modal and generate key
    setShowGenerationModal(true);

    try {
      await generateKey();
      setIsComplete(true);

      // Navigate to receive after a brief delay
      setTimeout(() => {
        navigate('/vault', { replace: true });
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
        navigate('/vault', { replace: true });
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
