import React from 'react';
import { Button, CircularProgress, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import type { FileWithPreview } from '@/types/secret.types';
import type { Recipient } from '@/types/secret.types';

interface SendSecretButtonProps {
  files: FileWithPreview[];
  recipients: Recipient[];
  onSend: () => void;
  isSending: boolean;
  disabled?: boolean;
}

/**
 * Main button to trigger secret sending
 */
export const SendSecretButton: React.FC<SendSecretButtonProps> = ({
  files,
  recipients,
  onSend,
  isSending,
  disabled = false,
}) => {
  const canSend = files.length > 0 && recipients.length > 0 && !isSending && !disabled;

  const getButtonText = () => {
    if (isSending) return 'Sending...';
    if (files.length === 0) return 'Add files to send';
    if (recipients.length === 0) return 'Add recipients';
    return 'Send Secret';
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Button
        variant="contained"
        size="large"
        onClick={onSend}
        disabled={!canSend}
        startIcon={isSending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
        sx={{
          minWidth: 200,
          py: 1.5,
          fontSize: '1.1rem',
          fontWeight: 600,
        }}
      >
        {getButtonText()}
      </Button>
    </Box>
  );
};
