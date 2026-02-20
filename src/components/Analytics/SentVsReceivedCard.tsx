import React from 'react';
import { Box, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { AnalyticsData } from '@/types/api.types';

interface SentVsReceivedCardProps {
  analytics: AnalyticsData | null;
  isLoading: boolean;
}

export const SentVsReceivedCard: React.FC<SentVsReceivedCardProps> = ({ analytics, isLoading }) => {

  if (isLoading || !analytics) {
    return (
      <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Card>
    );
  }

  const data = [
    { name: 'Sent', value: analytics.secrets_sent, fill: '#3F51B5' },
    { name: 'Received', value: analytics.secrets_received, fill: '#4CAF50' },
  ];

  const total = analytics.secrets_sent + analytics.secrets_received;

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
          Secrets Sent vs Received
        </Typography>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
          {total > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  // label={(entry: any) => `${entry.name}: ${entry.value} (${(entry.percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number | undefined) => value?.toString() || ''} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Typography color="text.secondary" align="center">
              No secrets yet
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
