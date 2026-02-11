import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Alert,
  AlertTitle,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface KeyWarningDialogProps {
  open: boolean;
  onAccept: () => void;
  onCancel: () => void;
  userHasKey?: boolean;
}

/**
 * Warning dialog about key storage and security implications
 * Shows different content if user already has a key
 */
export const KeyWarningDialog: React.FC<KeyWarningDialogProps> = ({
  open,
  onAccept,
  onCancel,
  userHasKey = false,
}) => {
  const [acknowledged, setAcknowledged] = React.useState(false);

  if (userHasKey) {
    return (
      <Dialog
        open={open}
        onClose={onCancel}
        maxWidth="sm"
        fullWidth
        aria-labelledby="key-ready-title"
      >
        <DialogTitle id="key-ready-title">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CheckCircleIcon sx={{ color: 'success.main', fontSize: 32 }} />
            <span>Encryption Key Ready</span>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Alert severity="success" sx={{ mb: 3 }}>
            <AlertTitle>You're All Set!</AlertTitle>
            Your encryption key is already configured and ready to use.
          </Alert>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body1" paragraph>
              You don't need to generate a new key. Your existing encryption setup allows you to:
            </Typography>

            <Box component="ul" sx={{ pl: 2 }}>
              <li>
                <Typography variant="body2" paragraph>
                  Receive encrypted secrets from other users
                </Typography>
              </li>
              <li>
                <Typography variant="body2" paragraph>
                  Decrypt secrets using your stored private key
                </Typography>
              </li>
              <li>
                <Typography variant="body2" paragraph>
                  Share your public key with others
                </Typography>
              </li>
            </Box>
          </Box>

          <Alert severity="info" icon={<LockIcon />}>
            <AlertTitle>Manage Your Keys</AlertTitle>
            <Typography variant="body2">
              You can view and manage your keys anytime from the "My Keys" page in the sidebar.
            </Typography>
          </Alert>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={onAccept}
            variant="contained"
            size="large"
          >
            Continue to App
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      aria-labelledby="key-warning-title"
    >
      <DialogTitle id="key-warning-title">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <WarningAmberIcon sx={{ color: 'warning.main', fontSize: 32 }} />
          <span>Important: Key Storage Warning</span>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>Your Private Key is Stored in Your Browser</AlertTitle>
          Please read and understand the following before continuing.
        </Alert>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LockIcon fontSize="small" />
            What This Means
          </Typography>

          <Box component="ul" sx={{ pl: 2 }}>
            <li>
              <Typography variant="body2" paragraph>
                Your private encryption key is stored <strong>only in your browser's local storage</strong>
              </Typography>
            </li>
            <li>
              <Typography variant="body2" paragraph>
                We <strong>cannot recover</strong> your key if you lose it
              </Typography>
            </li>
            <li>
              <Typography variant="body2" paragraph>
                Clearing your browser data will <strong>permanently delete</strong> your key
              </Typography>
            </li>
            <li>
              <Typography variant="body2" paragraph>
                Without your key, you <strong>cannot decrypt</strong> secrets sent to you
              </Typography>
            </li>
          </Box>
        </Box>

        <Alert severity="info" icon={<LockIcon />} sx={{ mb: 2 }}>
          <AlertTitle>Why We Do This</AlertTitle>
          <Typography variant="body2">
            This design ensures maximum security. Your private key never leaves your device,
            providing true end-to-end encryption. Even we cannot access your encrypted data.
          </Typography>
        </Alert>

        <Box sx={{ mt: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="body2">
                I understand that my private key is stored only in my browser and cannot be recovered if lost
              </Typography>
            }
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={onAccept}
          variant="contained"
          disabled={!acknowledged}
          size="large"
        >
          I Understand, Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};
