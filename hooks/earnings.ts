import { useQuery } from '@tanstack/react-query';
import { fetchEarnings } from 'helper/fetchEarnings';

export const useGetEarnings = (userId: number) => {
  return useQuery({
    queryKey: ['earnings', userId],
    queryFn: () => fetchEarnings(userId),
  });
};
