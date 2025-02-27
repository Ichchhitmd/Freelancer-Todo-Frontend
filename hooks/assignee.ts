import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getAllAssigners,
  fetchTotalAdvancePaid,
  processAssignerPaymentRequest,
  fetchAssignerFinancials,
} from 'helper/assignerRequest';

export const useProcessAssignerPayment = () => {
  return useMutation({
    mutationFn: (payload: { assignerName: string; userId: number; amount: number }) =>
      processAssignerPaymentRequest(payload),
    onSuccess: () => {},
    onError: () => {},
  });
};

export const useGetAllAssigners = (userId: number) => {
  return useQuery({
    queryKey: ['assigners', userId],
    queryFn: () => getAllAssigners(userId),
    enabled: !!userId,
  });
};

export const useFetchTotalAdvancePaid = (userId: number) => {
  return useQuery({
    queryKey: ['totalAdvancePaid', userId],
    queryFn: () => fetchTotalAdvancePaid(userId),
    enabled: !!userId,
  });
};

export const useFetchAssignerFinancials = (userId: number, assignerName: string) => {
  return useQuery({
    queryKey: ['assignerFinancials', userId, assignerName],
    queryFn: () => fetchAssignerFinancials(userId, assignerName),
    enabled: !!userId && !!assignerName,
  });
};
