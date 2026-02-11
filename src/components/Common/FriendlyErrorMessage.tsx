import React from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Collapse,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import type { FriendlyError } from '@/types/user.types';
import { mapErrorToFriendly } from '@/utils/errorMapping';

interface FriendlyErrorMessageProps {
  error: FriendlyError | Error | string | null;
  onClose?: () => void;
  onRetry?: () => void;
  severity?: 'error' | 'warning' | 'info';
}

/**
 * Display user-friendly error messages with optional details and actions
 */
export const FriendlyErrorMessage: React.FC<FriendlyErrorMessageProps> = ({
  error,
  onClose,
  onRetry,
  severity = 'error',
}) => {
  const [showDetails, setShowDetails] = React.useState(false);

  if (!error) {
    return null;
  }

  // Convert error to FriendlyError format
  const friendlyError: FriendlyError =
    typeof error === 'string'
      ? { title: 'Error', message: error, severity: 'error' }
      : error instanceof Error
      ? mapErrorToFriendly(error)
      : error;

  return (
    <Alert
      severity={severity}
      onClose={onClose}
      action={
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {onRetry && (
            <Button color="inherit" size="small" onClick={onRetry}>
              Retry
            </Button>
          )}
          {friendlyError.details && (
            <IconButton
              color="inherit"
              size="small"
              onClick={() => setShowDetails(!showDetails)}
              aria-label="toggle details"
            >
              {showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
          {onClose && (
            <IconButton
              color="inherit"
              size="small"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      }
      sx={{ mb: 2 }}
    >
      {friendlyError.title && <AlertTitle>{friendlyError.title}</AlertTitle>}
      <Typography variant="body2">{friendlyError.message}</Typography>

      {friendlyError.action && (
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {friendlyError.action}
          </Typography>
        </Box>
      )}

      {friendlyError.details && (
        <Collapse in={showDetails}>
          <Box
            sx={{
              mt: 2,
              p: 1,
              bgcolor: 'rgba(0, 0, 0, 0.05)',
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              wordBreak: 'break-all',
              maxHeight: 200,
              overflow: 'auto',
            }}
          >
            {friendlyError.details}
          </Box>
        </Collapse>
      )}
    </Alert>
  );
};
