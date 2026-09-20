import { useQuery } from '@tanstack/react-query';
import { getPublicResult } from '../result';
import { queryKeys } from '../queryKeys';

export function useResult(pollWhenNotFound = false) {
  return useQuery({
    queryKey: queryKeys.result,
    queryFn: getPublicResult,
    retry: 0,
    staleTime: 1000 * 15,
    refetchInterval: (query) => {
      // If pollWhenNotFound is true and no result yet (or error), poll every 20s
      if (pollWhenNotFound && (query.state.status === 'error' || !query.state.data)) {
        return 20000;
      }
      return false;
    },
  });
}
