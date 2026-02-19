import React from 'react';
import { Box, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import type { AnalyticsData } from '@/types/api.types';

interface QuotaUsageCardProps {
  analytics: AnalyticsData | null;
  isLoading: boolean;
}

const getColor = (percentage: number): string => {
  if (percentage >= 95) return '#d32f2f'; // Red
  if (percentage >= 75) return '#FBC02D'; // Yellow
  return '#3F51B5'; // Purple (primary color)
};

export const QuotaUsageCard: React.FC<QuotaUsageCardProps> = ({ analytics, isLoading }) => {
  if (isLoading || !analytics) {
    return (
      <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }

  const percentage = (analytics.active_secrets_sent / analytics.max_secrets_quota) * 100;
  const color = getColor(percentage);

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
          Active Sent Secrets
        </Typography>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Gauge
            value={percentage}
            startAngle={-110}
            endAngle={110}
            sx={{
              [`& .${gaugeClasses.valueText}`]: {
                fontSize: 24,
              },
              [`& .${gaugeClasses.valueArc}`]: {
                fill: color,
                animation: percentage >= 95
                  ? 'pulse 2s ease-in-out infinite'
                  : 'none',
              },
              '@keyframes pulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.6 },
              },
            }}
            text={`${percentage.toFixed(0)}%`}
          />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {analytics.active_secrets_sent} / {analytics.max_secrets_quota} secrets
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
