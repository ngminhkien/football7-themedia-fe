import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAdminPlayer,
  deleteAdminPlayer,
  getAdminPlayers,
  getAdminSettings,
  getAdminWarnings,
  loginAdmin,
  publishMatch,
  resetSystem,
  splitTeams,
  unpublishResult,
  updateAdminPlayer,
  updateAdminSettings,
  updatePlayerTier,
} from '../admin';
import { queryKeys } from '../queryKeys';
import { PlayerTier, SplitRequest } from '../types';

export function useAdminLogin() {
  return useMutation({
    mutationFn: (password: string) => loginAdmin(password),
  });
}

export function useAdminPlayers() {
  return useQuery({
    queryKey: queryKeys.admin.players,
    queryFn: getAdminPlayers,
  });
}

export function useCreateAdminPlayer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createAdminPlayer(name),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.players });
      qc.invalidateQueries({ queryKey: queryKeys.admin.warnings });
      qc.invalidateQueries({ queryKey: queryKeys.players });
    },
  });
}

export function useUpdateAdminPlayer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { name?: string; adminScore?: number | null; isActive?: boolean };
    }) => updateAdminPlayer(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.players });
      qc.invalidateQueries({ queryKey: queryKeys.admin.warnings });
      qc.invalidateQueries({ queryKey: queryKeys.players });
    },
  });
}

export function useUpdatePlayerTier() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, tier }: { id: number; tier: PlayerTier }) =>
      updatePlayerTier(id, tier),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.players });
      qc.invalidateQueries({ queryKey: queryKeys.admin.warnings });
    },
  });
}

export function useDeleteAdminPlayer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteAdminPlayer(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.players });
      qc.invalidateQueries({ queryKey: queryKeys.admin.warnings });
      qc.invalidateQueries({ queryKey: queryKeys.players });
    },
  });
}

export function useAdminWarnings() {
  return useQuery({
    queryKey: queryKeys.admin.warnings,
    queryFn: getAdminWarnings,
  });
}

export const useWarnings = useAdminWarnings;

export function useAdminSettings() {
  return useQuery({
    queryKey: queryKeys.admin.settings,
    queryFn: getAdminSettings,
  });
}

export function useUpdateAdminSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (registrationOpen: boolean) => updateAdminSettings(registrationOpen),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.settings });
      qc.invalidateQueries({ queryKey: queryKeys.settings });
    },
  });
}

export function useSplitTeams() {
  return useMutation({
    mutationFn: (request: SplitRequest) => splitTeams(request),
  });
}

export function usePublishMatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      matchId,
      names,
    }: {
      matchId: number;
      names?: { teamAName?: string; teamBName?: string };
    }) => publishMatch(matchId, names),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.result });
    },
  });
}

export function useUnpublishMatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: unpublishResult,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.result });
    },
  });
}

export function useResetSystem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (keepAdminScores: boolean) => resetSystem(keepAdminScores),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.admin.players });
      qc.invalidateQueries({ queryKey: queryKeys.admin.warnings });
      qc.invalidateQueries({ queryKey: queryKeys.players });
      qc.invalidateQueries({ queryKey: queryKeys.result });
    },
  });
}
