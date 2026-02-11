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
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import PersonIcon from '@mui/icons-material/Person';
import type { Secret } from '@/types/api.types';

interface SecretCardProps {
  secret: Secret;
  onDownload: (secretId: string) => void;
  onDelete: (secretId: string) => void;
  isDownloading: boolean;
}

/**
 * Card displaying individual secret information
 */
export const SecretCard: React.FC<SecretCardProps> = ({
  secret,
  onDownload,
  onDelete,
  isDownloading,
}) => {
  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'Unknown size';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  const getExpirationInfo = () => {
    if (!secret.expiration) {
      return { text: 'Never expires', color: 'default' as const, warning: false };
    }

    const expirationDate = new Date(secret.expiration);
    const now = new Date();
    const hoursUntilExpiration = Math.floor((expirationDate.getTime() - now.getTime()) / 3600000);

    if (hoursUntilExpiration < 0) {
      return { text: 'Expired', color: 'error' as const, warning: true };
    }

    if (hoursUntilExpiration < 24) {
      return {
        text: `Expires in ${hoursUntilExpiration} hour${hoursUntilExpiration !== 1 ? 's' : ''}`,
        color: 'error' as const,
        warning: true,
      };
    }

    const daysUntilExpiration = Math.floor(hoursUntilExpiration / 24);
    return {
      text: `Expires in ${daysUntilExpiration} day${daysUntilExpiration !== 1 ? 's' : ''}`,
      color: 'default' as const,
      warning: false,
    };
  };

  const expirationInfo = getExpirationInfo();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        '&:hover': {
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" component="h3" noWrap sx={{ flexGrow: 1, pr: 2 }}>
            {secret.reference || 'Secret Message'}
          </Typography>
          <IconButton
            size="small"
            onClick={() => onDelete(secret.reference)}
            disabled={isDownloading}
            aria-label="delete secret"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <PersonIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            From: <strong>{secret.sender_email || secret.sender || 'Unknown'}</strong>
          </Typography>
        </Box>

        <Tooltip title={new Date(secret.created_at || secret.sent_at).toLocaleString()}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <AccessTimeIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Received: {formatTimeAgo(secret.created_at || secret.sent_at)}
            </Typography>
          </Box>
        </Tooltip>

        {secret.size && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Size: {formatFileSize(secret.size)}
          </Typography>
        )}

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
          {secret.downloaded ? (
            <Chip
              icon={<CheckCircleIcon />}
              label="Downloaded"
              size="small"
              color="success"
              variant="outlined"
            />
          ) : (
            <Chip
              icon={<LockIcon />}
              label="Not downloaded"
              size="small"
              color="primary"
              variant="outlined"
            />
          )}

          {secret.onetime && (
            <Tooltip title="This secret will be deleted after first download" arrow>
              <Chip
                icon={<FlashOnIcon />}
                label="One-time"
                size="small"
                color="warning"
                variant="outlined"
              />
            </Tooltip>
          )}

          <Tooltip title={secret.expiration ? new Date(secret.expiration).toLocaleString() : 'No expiration'}>
            <Chip
              icon={expirationInfo.warning ? <WarningIcon /> : <AccessTimeIcon />}
              label={expirationInfo.text}
              size="small"
              color={expirationInfo.color}
              variant="outlined"
            />
          </Tooltip>
        </Box>
      </CardContent>

      <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
        <Box sx={{ width: '100%', px: 2 }}>
          <button
            onClick={() => onDownload(secret.reference)}
            disabled={isDownloading}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#fff',
              backgroundColor: isDownloading ? '#ccc' : '#3F51B5',
              border: 'none',
              borderRadius: '8px',
              cursor: isDownloading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {isDownloading ? 'Downloading...' : 'Download & Decrypt'}
          </button>
        </Box>
      </CardActions>
    </Card>
  );
};
