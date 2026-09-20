import { apiClient } from './client';
import { PublicResult } from './types';

export async function getPublicResult(): Promise<PublicResult> {
  const res = await apiClient.get<PublicResult>('/api/result');
  return res.data;
}
