import { apiClient } from './client';
import type { AnalyticsResponse, AnalyticsData } from '@/types/api.types';

/**
 * Get user analytics data
 */
export async function getAnalytics(): Promise<AnalyticsData> {
  const response = await apiClient.get<AnalyticsResponse>('/user/analytics');
  return response.data.analytics;
}
