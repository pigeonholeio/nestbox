import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface EncryptionStatusBadgeProps {
  status: 'encrypted' | 'decrypted' | 'encrypting' | 'decrypting' | 'error';
  size?: 'small' | 'medium';
  showIcon?: boolean;
  label?: string;
}

/**
 * Badge component to show encryption/decryption status
 */
export const EncryptionStatusBadge: React.FC<EncryptionStatusBadgeProps> = ({
  status,
  size = 'medium',
  showIcon = true,
  label,
}) => {
  const getConfig = () => {
    switch (status) {
      case 'encrypted':
        return {
          color: 'success' as const,
          icon: <LockIcon />,
          label: label || 'Encrypted',
          tooltip: 'This data is encrypted and secure',
        };
      case 'decrypted':
        return {
          color: 'default' as const,
          icon: <LockOpenIcon />,
          label: label || 'Decrypted',
          tooltip: 'This data has been decrypted',
        };
      case 'encrypting':
        return {
          color: 'primary' as const,
          icon: <LockIcon />,
          label: label || 'Encrypting...',
          tooltip: 'Encryption in progress',
        };
      case 'decrypting':
        return {
          color: 'primary' as const,
          icon: <LockOpenIcon />,
          label: label || 'Decrypting...',
          tooltip: 'Decryption in progress',
        };
      case 'error':
        return {
          color: 'error' as const,
          icon: <WarningIcon />,
          label: label || 'Error',
          tooltip: 'Encryption/decryption failed',
        };
      default:
        return {
          color: 'default' as const,
          icon: <CheckCircleIcon />,
          label: label || 'Unknown',
          tooltip: 'Status unknown',
        };
    }
  };

  const config = getConfig();

  return (
    <Tooltip title={config.tooltip} arrow>
      <Chip
        icon={showIcon ? config.icon : undefined}
        label={config.label}
        color={config.color}
        size={size}
        variant="outlined"
      />
    </Tooltip>
  );
};
