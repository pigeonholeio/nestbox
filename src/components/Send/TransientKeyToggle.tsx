import React from 'react';
import {
  Box,
  FormControlLabel,
  Switch,
  Typography,
  Alert,
  Collapse,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import InfoIcon from '@mui/icons-material/Info';

interface TransientKeyToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

/**
 * Toggle for enabling transient key mode
 */
export const TransientKeyToggle: React.FC<TransientKeyToggleProps> = ({
  enabled,
  onChange,
  disabled = false,
}) => {
  const [showInfo, setShowInfo] = React.useState(false);

  return (
    <Box>
      <FormControlLabel
        control={
          <Switch
            checked={enabled}
            onChange={(e) => {
              onChange(e.target.checked);
              if (e.target.checked) {
                setShowInfo(true);
              }
            }}
            disabled={disabled}
            color="warning"
          />
        }
        label={
          <Box>
            <Typography variant="body2" fontWeight={600}>
              Use Transient Keys
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Send to users without PigeonHole accounts
            </Typography>
          </Box>
        }
      />

      <Collapse in={enabled && showInfo}>
        <Alert
          severity="warning"
          icon={<WarningAmberIcon />}
          sx={{ mt: 2 }}
          onClose={() => setShowInfo(false)}
        >
          <Typography variant="body2" fontWeight={600} gutterBottom>
            Transient Key Security Notice
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            <li>
              <Typography variant="caption">
                Transient keys are temporary and less secure than permanent keys
              </Typography>
            </li>
            <li>
              <Typography variant="caption">
                Recipients should create a PigeonHole account for better security
              </Typography>
            </li>
            <li>
              <Typography variant="caption">
                The server generates these keys, reducing end-to-end security guarantees
              </Typography>
            </li>
          </Box>
        </Alert>
      </Collapse>

      {!enabled && (
        <Alert severity="info" icon={<InfoIcon />} sx={{ mt: 2 }}>
          <Typography variant="caption">
            Transient keys allow sending to email addresses not registered on PigeonHole.
            The system will create temporary keys for these users.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};
