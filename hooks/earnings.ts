import { useQuery } from '@tanstack/react-query';
import { fetchEarnings } from 'helper/fetchEarnings';

export const useGetEarnings = (userId: number) => {
  return useQuery({
    queryKey: ['earnings', userId],
    queryFn: () => fetchEarnings(userId),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 1000 * 60, // Consider data stale after 1 minute
  });
};
