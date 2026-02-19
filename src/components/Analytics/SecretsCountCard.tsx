import React from 'react';
import { Box, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import type { AnalyticsData } from '@/types/api.types';

interface SecretsCountCardProps {
  analytics: AnalyticsData | null;
  isLoading: boolean;
}

export const SecretsCountCard: React.FC<SecretsCountCardProps> = ({ analytics, isLoading }) => {
  if (isLoading || !analytics) {
    return (
      <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }

  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: 8,
        transform: 'translateY(-4px)',
      },
    }}>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" gutterBottom>
          Total Secrets Sent
        </Typography>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                color: 'primary.main',
              },
            }}
          >
            {analytics.secrets_sent}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Total secrets sent
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
