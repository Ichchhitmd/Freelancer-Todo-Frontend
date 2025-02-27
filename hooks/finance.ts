import { useQuery } from '@tanstack/react-query';
import { advanceReceipts, fetchFinancials } from 'helper/financialRequest';

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

export const useGetAdvanceReceipts = (userId?: number) => {
  return useQuery({
    queryKey: ['advance-receipts', userId],
    queryFn: () => {
      if (!userId) return Promise.reject('Missing parameters');
      return advanceReceipts(userId);
    },
    enabled: !!userId,
  });
};
