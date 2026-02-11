import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import LockOpenIcon from '@mui/icons-material/LockOpen';

interface DownloadSecretButtonProps {
  onDownload: () => void;
  isDownloading: boolean;
  isDecrypted?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

/**
 * Button to download and decrypt a secret
 */
export const DownloadSecretButton: React.FC<DownloadSecretButtonProps> = ({
  onDownload,
  isDownloading,
  isDecrypted = false,
  disabled = false,
  fullWidth = false,
}) => {
  return (
    <Button
      variant="contained"
      size="large"
      onClick={onDownload}
      disabled={disabled || isDownloading}
      fullWidth={fullWidth}
      startIcon={
        isDownloading ? (
          <CircularProgress size={20} color="inherit" />
        ) : isDecrypted ? (
          <DownloadIcon />
        ) : (
          <LockOpenIcon />
        )
      }
      sx={{
        py: 1.5,
        fontWeight: 600,
      }}
    >
      {isDownloading
        ? 'Decrypting...'
        : isDecrypted
        ? 'Download Files'
        : 'Download & Decrypt'}
    </Button>
  );
};
