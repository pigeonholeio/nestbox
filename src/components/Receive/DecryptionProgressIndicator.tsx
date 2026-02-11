import React from 'react';
import {
  Box,
  LinearProgress,
  Typography,
  Paper,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface ProgressStage {
  stage: string;
  percent: number;
}

interface DecryptionProgressIndicatorProps {
  decryptionProgress: ProgressStage;
  downloadProgress: ProgressStage;
}

/**
 * Progress indicator showing decryption and download stages
 */
export const DecryptionProgressIndicator: React.FC<DecryptionProgressIndicatorProps> = ({
  decryptionProgress,
  downloadProgress,
}) => {
  const isDecrypting = decryptionProgress.percent < 100;
  const isDownloading = decryptionProgress.percent === 100 && downloadProgress.percent < 100;
  const isComplete = downloadProgress.percent === 100;

  return (
    <Paper sx={{ p: 3, bgcolor: 'background.default' }}>
      <Typography variant="h6" gutterBottom>
        {isComplete ? 'Complete!' : isDecrypting ? 'Decrypting...' : 'Downloading...'}
      </Typography>

      {/* Decryption Progress */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          {decryptionProgress.percent === 100 ? (
            <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
          ) : (
            <LockIcon sx={{ color: 'primary.main', fontSize: 20 }} />
          )}
          <Typography variant="body2" fontWeight={600}>
            {decryptionProgress.stage}
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={decryptionProgress.percent}
          color={decryptionProgress.percent === 100 ? 'success' : 'primary'}
          sx={{
            height: 8,
            borderRadius: 4,
            mb: 0.5,
          }}
        />

        <Typography variant="caption" color="text.secondary">
          {decryptionProgress.percent}% complete
        </Typography>
      </Box>

      {/* Download Progress */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          {downloadProgress.percent === 100 ? (
            <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
          ) : (
            <DownloadIcon
              sx={{
                color: isDownloading ? 'secondary.main' : 'text.disabled',
                fontSize: 20,
              }}
            />
          )}
          <Typography
            variant="body2"
            fontWeight={600}
            color={isDownloading ? 'text.primary' : 'text.secondary'}
          >
            {downloadProgress.stage}
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={downloadProgress.percent}
          color={downloadProgress.percent === 100 ? 'success' : 'secondary'}
          sx={{
            height: 8,
            borderRadius: 4,
            mb: 0.5,
            opacity: isDownloading || downloadProgress.percent === 100 ? 1 : 0.5,
          }}
        />

        <Typography variant="caption" color="text.secondary">
          {downloadProgress.percent}% complete
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
              Files decrypted and downloaded!
            </Typography>
            <Typography variant="body2">
              Check your Downloads folder
            </Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
};
