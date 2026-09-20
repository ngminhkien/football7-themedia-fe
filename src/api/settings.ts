import { apiClient } from './client';
import { HealthResponse, PublicSettings } from './types';

export async function getPublicSettings(): Promise<PublicSettings> {
  const res = await apiClient.get<PublicSettings>('/api/settings');
  return res.data;
}

export async function getHealth(): Promise<HealthResponse> {
  const res = await apiClient.get<HealthResponse>('/api/health');
  return res.data;
}
