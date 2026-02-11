import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  LinearProgress,
  Alert,
  AlertTitle,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface KeyGenerationModalProps {
  open: boolean;
  progress: number;
  isComplete: boolean;
  error?: string | null;
}

/**
 * Modal showing key generation progress with security warnings
 */
export const KeyGenerationModal: React.FC<KeyGenerationModalProps> = ({
  open,
  progress,
  isComplete,
  error,
}) => {
  const getProgressMessage = () => {
    if (error) return 'Generation failed';
    if (isComplete) return 'Key generation complete!';
    if (progress === 0) return 'Initializing...';
    if (progress < 40) return 'Generating keypair...';
    if (progress < 70) return 'Encrypting private key...';
    if (progress < 90) return 'Calculating fingerprint...';
    return 'Finalizing...';
  };

  return (
    <Dialog
      open={open}
      disableEscapeKeyDown
      maxWidth="sm"
      fullWidth
      aria-labelledby="key-generation-title"
    >
      <DialogTitle id="key-generation-title">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isComplete ? (
            <CheckCircleIcon sx={{ color: 'success.main', fontSize: 32 }} />
          ) : (
            <LockIcon sx={{ color: 'primary.main', fontSize: 32 }} />
          )}
          <span>
            {isComplete ? 'Welcome to PigeonHole' : 'Generating Your Encryption Key'}
          </span>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          {!error && !isComplete && (
            <>
              <Typography variant="body1" gutterBottom>
                {getProgressMessage()}
              </Typography>
              <Box sx={{ mt: 2, mb: 3 }}>
                <LinearProgress
                  variant="determinate"
                  value={progress}
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: 'block' }}
                >
                  {progress}% complete
                </Typography>
              </Box>
            </>
          )}

          {isComplete && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <AlertTitle>Success!</AlertTitle>
              Your encryption key has been generated and stored securely in your browser.
            </Alert>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              <AlertTitle>Generation Failed</AlertTitle>
              {error}
            </Alert>
          )}

          {!isComplete && (
            <Alert severity="warning" icon={<LockIcon />}>
              <AlertTitle>Important Security Notice</AlertTitle>
              <Box component="ul" sx={{ m: 0, pl: 2 }}>
                <li>
                  <Typography variant="body2">
                    Your private key is stored <strong>only in your browser</strong>
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    If you clear browser data, your key will be permanently lost
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Lost keys mean you cannot decrypt previously received secrets
                  </Typography>
                </li>
              </Box>
            </Alert>
          )}

          {!error && !isComplete && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CheckCircleIcon fontSize="small" />
                Your key never leaves your browser
              </Typography>
              <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CheckCircleIcon fontSize="small" />
                End-to-end encryption
              </Typography>
              <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckCircleIcon fontSize="small" />
                Zero-knowledge architecture
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
