import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LockIcon from '@mui/icons-material/Lock';
import type { UserKey } from '@/types/api.types';

interface KeyCardProps {
  userKey: UserKey;
  onDelete: (keyId: string) => void;
  isDeleting: boolean;
}

/**
 * Card displaying individual key information
 */
export const KeyCard: React.FC<KeyCardProps> = ({
  userKey,
  onDelete,
  isDeleting,
}) => {
  const isEphemeral = userKey.reference?.includes('ephemeral');
  const thumbprintShort = userKey.thumbprint.substring(0, 16) + '...';

  const handleCopyThumbprint = () => {
    navigator.clipboard.writeText(userKey.thumbprint);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        opacity: isDeleting ? 0.6 : 1,
        transition: 'opacity 0.2s',
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h3" noWrap sx={{ flexGrow: 1, pr: 2 }}>
            {userKey.reference || 'Untitled Key'}
          </Typography>
          <IconButton
            size="small"
            onClick={() => onDelete(userKey.id)}
            disabled={isDeleting}
            aria-label="delete key"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <LockIcon fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary" noWrap sx={{ flex: 1 }}>
            {thumbprintShort}
          </Typography>
          <Tooltip title="Copy full thumbprint">
            <IconButton size="small" onClick={handleCopyThumbprint}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Created: {formatDate(userKey.created_at)}
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {isEphemeral ? (
            <Tooltip title="This is a temporary key generated for transient sharing">
              <Chip
                label="Ephemeral"
                size="small"
                color="warning"
                variant="outlined"
              />
            </Tooltip>
          ) : (
            <Chip
              label="Permanent"
              size="small"
              color="success"
              variant="outlined"
            />
          )}
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', pt: 0 }}>
        <Typography variant="caption" color="text.secondary">
          Key ID: {userKey.id.substring(0, 8)}...
        </Typography>
      </CardActions>
    </Card>
  );
};
