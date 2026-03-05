import React, { useMemo } from 'react';
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
import StorageIcon from '@mui/icons-material/Storage';
import type { UserKey } from '@/types/api.types';
import { useKeyStore } from '@/stores/keyStore';

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
  const { currentKey } = useKeyStore();

  const isEphemeral = userKey.reference?.includes('ephemeral');
  const fingerprintShort = userKey.fingerprint.substring(0, 16) + '...';

  // Check if the private key for this public key exists in the browser
  const hasPrivateKey = useMemo(() => {
    return currentKey?.fingerprint === userKey.fingerprint;
  }, [currentKey?.fingerprint, userKey.fingerprint]);

  const handleCopyFingerprint = () => {
    navigator.clipboard.writeText(userKey.fingerprint);
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
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: 8,
          transform: 'translateY(-4px)',
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
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', mb: 0.25 }}>
              Fingerprint
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
              {fingerprintShort}
            </Typography>
          </Box>
          <Tooltip title="Copy full fingerprint">
            <IconButton size="small" onClick={handleCopyFingerprint}>
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

          {hasPrivateKey ? (
            <Tooltip title="Private key is stored in this browser">
              <Chip
                icon={<StorageIcon />}
                label="Private Key Available"
                size="small"
                variant="outlined"
                sx={{
                  color: '#a78bfa',
                  backgroundColor: 'rgba(167, 139, 250, 0.12)',
                  borderColor: '#a78bfa',
                  border: '1px solid',
                  fontWeight: 600,
                  animation: 'softPulse 2.5s ease-in-out infinite',
                  '&:hover': {
                    backgroundColor: 'rgba(167, 139, 250, 0.18)',
                    boxShadow: '0 0 16px rgba(167, 139, 250, 0.3)',
                  },
                }}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Private key is not stored in this browser">
              <Chip
                icon={<StorageIcon />}
                label="No Local Key Found"
                size="small"
                color="default"
                variant="outlined"
              />
            </Tooltip>
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
