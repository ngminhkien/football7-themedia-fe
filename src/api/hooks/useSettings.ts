import { useQuery } from '@tanstack/react-query';
import { getPublicSettings } from '../settings';
import { queryKeys } from '../queryKeys';

export function useSettings() {
  return useQuery({
    queryKey: queryKeys.settings,
    queryFn: getPublicSettings,
    staleTime: 1000 * 60, // 1 minute
  });
}
