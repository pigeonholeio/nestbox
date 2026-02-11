import React from 'react';
import {
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  FormControlLabel,
  Checkbox,
  Paper,
  Chip,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import type { ExpirationPreset } from '@/types/secret.types';
import { EXPIRATION_PRESETS } from '@/types/secret.types';

interface SecretOptionsPanelProps {
  expiration: ExpirationPreset;
  onExpirationChange: (preset: ExpirationPreset) => void;
  onetime: boolean;
  onOnetimeChange: (enabled: boolean) => void;
  disabled?: boolean;
}

/**
 * Panel for secret expiration and one-time options
 */
export const SecretOptionsPanel: React.FC<SecretOptionsPanelProps> = ({
  expiration,
  onExpirationChange,
  onetime,
  onOnetimeChange,
  disabled = false,
}) => {
  const presets: ExpirationPreset[] = ['1hour', '24hours', '7days', '28days', 'never'];

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <AccessTimeIcon color="primary" />
          <Typography variant="subtitle1" fontWeight={600}>
            Expiration
          </Typography>
        </Box>

        <ToggleButtonGroup
          value={expiration}
          exclusive
          onChange={(_, value) => {
            if (value !== null) {
              onExpirationChange(value as ExpirationPreset);
            }
          }}
          disabled={disabled}
          fullWidth
          color="primary"
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: 1,
            '& .MuiToggleButton-root': {
              borderRadius: 1,
            },
          }}
        >
          {presets.map((preset) => (
            <ToggleButton key={preset} value={preset} aria-label={EXPIRATION_PRESETS[preset].label}>
              {EXPIRATION_PRESETS[preset].label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {expiration === 'never'
            ? 'Secret will never expire automatically'
            : expiration === '28days'
            ? 'Default: Secret expires in 28 days'
            : `Secret will expire in ${EXPIRATION_PRESETS[expiration].label.toLowerCase()}`}
        </Typography>
      </Box>

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <FlashOnIcon color="warning" />
          <Typography variant="subtitle1" fontWeight={600}>
            Self-Destruct
          </Typography>
        </Box>

        <FormControlLabel
          control={
            <Checkbox
              checked={onetime}
              onChange={(e) => onOnetimeChange(e.target.checked)}
              disabled={disabled}
              color="warning"
            />
          }
          label={
            <Box>
              <Typography variant="body2">
                One-Time Secret
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Delete immediately after first download
              </Typography>
            </Box>
          }
        />

        {onetime && (
          <Box sx={{ mt: 2 }}>
            <Chip
              icon={<FlashOnIcon />}
              label="Self-destruct enabled"
              color="warning"
              size="small"
              variant="outlined"
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              The secret will be permanently deleted after the recipient downloads it
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};
