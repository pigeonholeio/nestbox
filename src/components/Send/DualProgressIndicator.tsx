import React from 'react';
import {
  Box,
  LinearProgress,
  Typography,
  Paper,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface ProgressStage {
  stage: string;
  percent: number;
}

interface DualProgressIndicatorProps {
  encryptionProgress: ProgressStage;
  uploadProgress: ProgressStage;
  isComplete?: boolean;
}

/**
 * Dual progress indicator showing encryption and upload stages
 */
export const DualProgressIndicator: React.FC<DualProgressIndicatorProps> = ({
  encryptionProgress,
  uploadProgress,
  isComplete = false,
}) => {
  const isEncrypting = encryptionProgress.percent < 100;
  const isUploading = encryptionProgress.percent === 100 && uploadProgress.percent < 100;

  return (
    <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
      <Typography variant="h6" gutterBottom>
        {isComplete ? 'Complete!' : isEncrypting ? 'Encrypting...' : 'Uploading...'}
      </Typography>

      {/* Encryption Progress */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          {encryptionProgress.percent === 100 ? (
            <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
          ) : (
            <LockIcon sx={{ color: 'primary.main', fontSize: 20 }} />
          )}
          <Typography variant="body2" fontWeight={600}>
            {encryptionProgress.stage}
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={encryptionProgress.percent}
          color={encryptionProgress.percent === 100 ? 'success' : 'primary'}
          sx={{
            height: 8,
            borderRadius: 4,
            mb: 0.5,
          }}
        />

        <Typography variant="caption" color="text.secondary">
          {encryptionProgress.percent}% complete
        </Typography>
      </Box>

      {/* Upload Progress */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          {uploadProgress.percent === 100 ? (
            <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
          ) : (
            <CloudUploadIcon
              sx={{
                color: isUploading ? 'secondary.main' : 'text.disabled',
                fontSize: 20,
              }}
            />
          )}
          <Typography
            variant="body2"
            fontWeight={600}
            color={isUploading ? 'text.primary' : 'text.secondary'}
          >
            {uploadProgress.stage}
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={uploadProgress.percent}
          color={uploadProgress.percent === 100 ? 'success' : 'secondary'}
          sx={{
            height: 8,
            borderRadius: 4,
            mb: 0.5,
            opacity: isUploading || uploadProgress.percent === 100 ? 1 : 0.5,
          }}
        />

        <Typography variant="caption" color="text.secondary">
          {uploadProgress.percent}% complete
        </Typography>
      </Box>

      {isComplete && (
        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: 'success.main',
            color: 'success.contrastText',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <CheckCircleIcon />
          <Box>
            <Typography variant="body1" fontWeight={600}>
              Secret sent successfully!
            </Typography>
            <Typography variant="body2">
              Your recipients will be notified
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
};
