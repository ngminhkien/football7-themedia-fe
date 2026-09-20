import { apiClient } from './client';
import { PublicPlayer, SubmissionRequest } from './types';

export async function getPublicPlayers(): Promise<PublicPlayer[]> {
  const res = await apiClient.get<PublicPlayer[]>('/api/players');
  return res.data;
}

export async function submitPlayer(
  playerId: number,
  request: SubmissionRequest
): Promise<{ id: number; submitted: boolean }> {
  const res = await apiClient.post<{ id: number; submitted: boolean }>(
    `/api/players/${playerId}/submission`,
    request
  );
  return res.data;
}
