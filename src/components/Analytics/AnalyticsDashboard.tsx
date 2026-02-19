import React, { forwardRef } from 'react';
import { Box, Grid, Alert } from '@mui/material';
import { SentVsReceivedCard } from './SentVsReceivedCard';
import { QuotaUsageCard } from './QuotaUsageCard';
import { DataSentCard } from './DataSentCard';
import { SecretsCountCard } from './SecretsCountCard';
import { useAnalytics } from '@/hooks/useAnalytics';

export interface AnalyticsDashboardRef {
  refresh: () => void;
}

export const AnalyticsDashboard = forwardRef<AnalyticsDashboardRef>((_props, ref) => {
  const { analytics, isLoading, error, refetch } = useAnalytics();

  React.useImperativeHandle(ref, () => ({
    refresh: () => refetch(),
  }));

  if (error) {
    return <Alert severity="error">Failed to load analytics: {error}</Alert>;
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SentVsReceivedCard analytics={analytics} isLoading={isLoading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <QuotaUsageCard analytics={analytics} isLoading={isLoading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DataSentCard analytics={analytics} isLoading={isLoading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SecretsCountCard analytics={analytics} isLoading={isLoading} />
        </Grid>
      </Grid>
    </Box>
  );
});

AnalyticsDashboard.displayName = 'AnalyticsDashboard';
