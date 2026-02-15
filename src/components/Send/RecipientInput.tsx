import React, { useState } from 'react';
import {
  Box,
  TextField,
  Chip,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Tooltip,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WarningIcon from '@mui/icons-material/Warning';
import type { Recipient } from '@/types/secret.types';
import type { User } from '@/types/api.types';

interface RecipientInputProps {
  recipients: Recipient[];
  onRecipientsChange: (recipients: Recipient[]) => void;
  onSearchUser: (email: string, useTransient: boolean) => Promise<User | null>;
  maxRecipients?: number;
  disabled?: boolean;
}

/**
 * Email input for recipients with user search and transient key support
 */
export const RecipientInput: React.FC<RecipientInputProps> = ({
  recipients,
  onRecipientsChange,
  onSearchUser,
  maxRecipients = 3,
  disabled = false,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [showTransientPrompt, setShowTransientPrompt] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = async (value: string) => {
    setEmailInput(value);
    setSearchError(null);

    const trimmed = value.trim();

    // Check if ends with space or comma (trigger add)
    if ((value.endsWith(' ') || value.endsWith(',')) && trimmed) {
      const email = trimmed.toLowerCase();

      if (validateEmail(email)) {
        await addRecipientByEmail(email);
      }
      return;
    }

    // Auto-detect valid email and trigger lookup
    if (trimmed && validateEmail(trimmed)) {
      const email = trimmed.toLowerCase();

      // Don't re-search if already added
      if (recipients.some((r) => r.email === email)) {
        return;
      }

      // Debounce: only trigger after user stops typing (handled by blur/enter)
    }
  };

  const addRecipientByEmail = async (email: string, useTransient: boolean = false) => {
    // Check if recipient already added
    if (recipients.some((r) => r.email === email)) {
      setSearchError('This recipient is already added');
      setEmailInput('');
      return;
    }

    // Check max recipients
    if (recipients.length >= maxRecipients) {
      setSearchError(`Maximum ${maxRecipients} recipients allowed`);
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setShowTransientPrompt(false);

    try {
      const user = await onSearchUser(email, useTransient);

      if (user) {
        const newRecipient: Recipient = {
          email: user.email,
          user_id: user.id,
          isTransient: useTransient,
          keyFingerprint: user.keys[0]?.thumbprint,
        };

        onRecipientsChange([...recipients, newRecipient]);
        setEmailInput('');
        setPendingEmail(null);
        setShowTransientPrompt(false);
      } else {
        // User not found - prompt for transient key
        setPendingEmail(email);
        setShowTransientPrompt(true);
        setEmailInput('');
      }
    } catch (error) {
      setSearchError(
        error instanceof Error ? error.message : 'Failed to search for user'
      );
      setEmailInput('');
    } finally {
      setIsSearching(false);
    }
  };

  const handleUseTransient = async () => {
    if (pendingEmail) {
      await addRecipientByEmail(pendingEmail, true);
    }
  };

  const handleCancelTransient = () => {
    setPendingEmail(null);
    setShowTransientPrompt(false);
  };

  const handleRemoveRecipient = (email: string) => {
    onRecipientsChange(recipients.filter((r) => r.email !== email));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      const email = emailInput.trim().toLowerCase();
      if (email && validateEmail(email)) {
        addRecipientByEmail(email);
      }
    }
  };

  const handleBlur = () => {
    const email = emailInput.trim().toLowerCase();
    if (email && validateEmail(email)) {
      addRecipientByEmail(email);
    }
  };


  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Recipients
      </Typography>

      <TextField
        fullWidth
        label="Recipient Email Address"
        placeholder="Enter email address (press Enter, comma, or space to add)"
        value={emailInput}
        onChange={(e) => handleEmailChange(e.target.value)}
        onKeyPress={handleKeyPress}
        onBlur={handleBlur}
        disabled={disabled || isSearching || recipients.length >= maxRecipients}
        InputProps={{
          endAdornment: isSearching ? <CircularProgress size={24} /> : null,
        }}
        helperText={`You can add up to ${maxRecipients} recipients. Email validates automatically.`}
        sx={{ mb: 2 }}
      />

      {showTransientPrompt && pendingEmail && (
        <Alert
          severity="warning"
          icon={<WarningIcon />}
          sx={{ mb: 2 }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" fontWeight={600}>
              User not found: {pendingEmail}
            </Typography>
            <Typography variant="caption" display="block" sx={{ mb: 1 }}>
              This email isn't registered. You can use a transient/ephemeral key (less secure) or ask them to create an account first.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                size="small"
                variant="contained"
                color="warning"
                onClick={handleUseTransient}
              >
                Use Transient Key
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={handleCancelTransient}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Alert>
      )}

      {searchError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setSearchError(null)}>
          {searchError}
        </Alert>
      )}

      {recipients.length > 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {recipients.map((recipient) => (
            <Tooltip
              key={recipient.email}
              title={
                recipient.keyFingerprint
                  ? `Key: ${recipient.keyFingerprint}`
                  : 'Transient key'
              }
              arrow
            >
              <Chip
                icon={
                  recipient.isTransient ? (
                    <WarningIcon fontSize="small" />
                  ) : (
                    <VerifiedUserIcon fontSize="small" />
                  )
                }
                label={recipient.email}
                onDelete={() => handleRemoveRecipient(recipient.email)}
                color={recipient.isTransient ? 'warning' : 'primary'}
                variant="outlined"
              />
            </Tooltip>
          ))}
        </Box>
      )}

      {recipients.some((r) => r.isTransient) && (
        <Alert severity="info" icon={<PersonAddIcon />} sx={{ mt: 2 }}>
          <Typography variant="body2" fontWeight={600}>
            Transient Keys Enabled
          </Typography>
          <Typography variant="caption" display="block">
            Some recipients will receive an ephemeral key. For better security, they should
            create a PigeonHole account first.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};
