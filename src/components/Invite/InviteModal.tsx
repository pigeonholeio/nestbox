import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Button,
  TextField,
  Chip,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SendIcon from '@mui/icons-material/Send';
import { sendInvites, checkUserExists } from '@/services/api/invite.api';

interface InviteModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Modal for inviting recipients to PigeonHole
 */
export const InviteModal: React.FC<InviteModalProps> = ({ open, onClose }) => {
  const [emailInput, setEmailInput] = useState('');
  const [recipients, setRecipients] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setEmailInput('');
      setRecipients([]);
      setSearchError(null);
      setSuccessMessage(null);
      setErrorMessage(null);
    }
  }, [open]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = async (value: string) => {
    setEmailInput(value);
    setSearchError(null);

    const trimmed = value.trim();

    // Check if ends with space, comma or enter (trigger add)
    if ((value.endsWith(' ') || value.endsWith(',')) && trimmed) {
      const email = trimmed.toLowerCase();
      if (validateEmail(email)) {
        await addRecipient(email);
      }
      return;
    }
  };

  const addRecipient = async (email: string) => {
    email = email.toLowerCase();

    // Check if already added
    if (recipients.includes(email)) {
      setSearchError('This recipient is already added');
      setEmailInput('');
      return;
    }

    // Check if user already exists
    setIsSearching(true);
    try {
      const exists = await checkUserExists(email);
      if (exists) {
        setSearchError(`User ${email} already has a PigeonHole account. Send them a secret instead!`);
        setEmailInput('');
        setIsSearching(false);
        return;
      }

      // Add to recipients list
      setRecipients([...recipients, email]);
      setEmailInput('');
      setSearchError(null);
    } catch (err) {
      setSearchError('Failed to validate user. Please try again.');
      console.error('User check error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ' ' || e.key === ',') && emailInput.trim()) {
      e.preventDefault();
      const email = emailInput.trim().replace(/[,\s]$/, '').toLowerCase();
      if (validateEmail(email)) {
        addRecipient(email);
      }
    }
  };

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter((r) => r !== email));
  };

  const handleSendInvites = async () => {
    if (recipients.length === 0) {
      setErrorMessage('Please add at least one recipient');
      return;
    }

    setIsSending(true);
    try {
      const result = await sendInvites(recipients);
      setSuccessMessage(`Invitations sent to ${result.sent_count} recipient(s)`);
      setRecipients([]);
      setEmailInput('');

      // Close modal after success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setErrorMessage('Failed to send invitations. Please try again.');
      console.error('Send invites error:', err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '90vh',
            overflow: 'auto',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            pb: 1,
          }}
        >
          Invite Recipients
          <IconButton
            edge="end"
            color="inherit"
            onClick={onClose}
            size="small"
            sx={{
              color: 'text.primary',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {/* Info Panel */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                🔐 Invite members before sending secrets
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Inviting recipients ensures they can securely receive your secrets. They'll create an account and upload their public key, guaranteeing secure delivery with end-to-end encryption.
              </Typography>
            </Paper>

            {/* Email Input */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <TextField
                fullWidth
                placeholder="Enter email address and press Enter"
                value={emailInput}
                onChange={(e) => handleEmailChange(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSending}
                size="small"
                variant="outlined"
                InputProps={{
                  endAdornment: isSearching && (
                    <CircularProgress color="inherit" size={20} />
                  ),
                }}
              />

              {searchError && (
                <Alert severity="warning" sx={{ py: 1, fontSize: '0.875rem' }}>
                  {searchError}
                </Alert>
              )}

              {/* Recipients List */}
              {recipients.length > 0 && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {recipients.map((email) => (
                    <Chip
                      key={email}
                      label={email}
                      onDelete={() => removeRecipient(email)}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              )}
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', pt: 1 }}>
              <Button
                variant="outlined"
                onClick={onClose}
                disabled={isSending}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={isSending ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                onClick={handleSendInvites}
                disabled={recipients.length === 0 || isSending}
              >
                {isSending ? 'Sending...' : 'Send Invites'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Snackbars for feedback */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
        message={successMessage}
      />
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(null)}
      >
        <Alert
          onClose={() => setErrorMessage(null)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
