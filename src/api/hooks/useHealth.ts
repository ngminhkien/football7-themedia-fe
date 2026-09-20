import { useQuery } from '@tanstack/react-query';
import { getHealth } from '../settings';
import { queryKeys } from '../queryKeys';

export function useHealth() {
  const query = useQuery({
    queryKey: queryKeys.health,
    queryFn: getHealth,
    refetchInterval: 15000, // poll every 15s
    retry: 1,
    staleTime: 10000,
  });

  return {
    ...query,
    isOnline: query.isSuccess && (query.data?.status === 'ok' || query.data?.db === 'up'),
  };
}
