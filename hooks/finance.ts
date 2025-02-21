import { useQuery } from '@tanstack/react-query';
import { fetchFinancials } from 'helper/financialRequest';

export const useGetFinancials = (userId?: number, companyId?: number) => {
  return useQuery({
    queryKey: ['financials', userId, companyId],
    queryFn: () => {
      if (!userId || !companyId) return Promise.reject('Missing parameters');
      return fetchFinancials(userId, companyId);
    },
    enabled: !!userId && !!companyId,
  });
};
