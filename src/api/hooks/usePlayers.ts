import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getPublicPlayers, submitPlayer } from '../players';
import { queryKeys } from '../queryKeys';
import { SubmissionRequest } from '../types';

export function usePlayers() {
  return useQuery({
    queryKey: queryKeys.players,
    queryFn: getPublicPlayers,
    staleTime: 1000 * 30, // 30s
  });
}

export function useSubmitPlayer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ playerId, request }: { playerId: number; request: SubmissionRequest }) =>
      submitPlayer(playerId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.players });
    },
  });
}
