import React from 'react';
import { Box, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import type { AnalyticsData } from '@/types/api.types';

interface DataSentCardProps {
  analytics: AnalyticsData | null;
  isLoading: boolean;
}

const getColor = (percentage: number): string => {
  if (percentage >= 95) return '#d32f2f'; // Red
  if (percentage >= 75) return '#FBC02D'; // Yellow
  return '#3F51B5'; // Purple (primary color)
};

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const DataSentCard: React.FC<DataSentCardProps> = ({ analytics, isLoading }) => {
  if (isLoading || !analytics) {
    return (
      <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }

  const percentage = (analytics.total_bytes_sent / analytics.max_bytes_quota) * 100;
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
          Encrypted Data
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
            {formatBytes(analytics.total_bytes_sent)} / {formatBytes(analytics.max_bytes_quota)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
