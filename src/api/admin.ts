import { apiClient } from './client';
import {
  AdminLoginResponse,
  AdminPlayer,
  PlayerTier,
  PublicResult,
  SplitPlan,
  SplitRequest,
  Warning,
} from './types';

export async function loginAdmin(password: string): Promise<AdminLoginResponse> {
  const res = await apiClient.post<AdminLoginResponse>('/api/admin/login', { password });
  return res.data;
}

export async function getAdminPlayers(): Promise<AdminPlayer[]> {
  const res = await apiClient.get<AdminPlayer[]>('/api/admin/players');
  return res.data;
}

export async function createAdminPlayer(name: string): Promise<AdminPlayer> {
  const res = await apiClient.post<AdminPlayer>('/api/admin/players', { name });
  return res.data;
}

export async function updateAdminPlayer(
  id: number,
  data: { name?: string; adminScore?: number | null; isActive?: boolean }
): Promise<AdminPlayer> {
  const res = await apiClient.put<AdminPlayer>(`/api/admin/players/${id}`, data);
  return res.data;
}

export async function updatePlayerTier(
  id: number,
  tier: PlayerTier
): Promise<AdminPlayer> {
  const res = await apiClient.put<AdminPlayer>(`/api/admin/players/${id}`, { tier });
  return res.data;
}

export async function deleteAdminPlayer(id: number): Promise<void> {
  await apiClient.delete(`/api/admin/players/${id}`);
}

export async function getAdminWarnings(): Promise<{ items: Warning[] }> {
  const res = await apiClient.get<{ items: Warning[] }>('/api/admin/warnings');
  return res.data;
}

export async function getAdminSettings(): Promise<{ registrationOpen: boolean }> {
  const res = await apiClient.get<{ registrationOpen: boolean }>('/api/admin/settings');
  return res.data;
}

export async function updateAdminSettings(
  registrationOpen: boolean
): Promise<{ registrationOpen: boolean }> {
  const res = await apiClient.put<{ registrationOpen: boolean }>('/api/admin/settings', {
    registrationOpen,
  });
  return res.data;
}

export async function splitTeams(request: SplitRequest): Promise<{ plans: SplitPlan[] }> {
  const res = await apiClient.post<{ plans: SplitPlan[] }>('/api/admin/split', request);
  return res.data;
}

export async function publishMatch(
  id: number,
  teamNames?: { teamAName?: string; teamBName?: string }
): Promise<PublicResult> {
  const res = await apiClient.post<PublicResult>(
    `/api/admin/matches/${id}/publish`,
    teamNames || {}
  );
  return res.data;
}

export async function unpublishResult(): Promise<void> {
  await apiClient.post('/api/admin/result/unpublish');
}

export async function resetSystem(keepAdminScores: boolean): Promise<void> {
  await apiClient.post('/api/admin/reset', { keepAdminScores });
}
