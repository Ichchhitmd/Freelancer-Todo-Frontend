import { useMutation } from '@tanstack/react-query';
import { addEventIncome, postIncome } from 'helper/incomeRequest';

export const usePostIncome = () => {
  return useMutation({
    mutationFn: (payload: { companyId: number; userId: number; amount: number }) =>
      postIncome(payload),
    onSuccess: () => {},
    onError: () => {},
  });
};

export const useAddEventIncome = () => {
  return useMutation({
    mutationFn: (payload: { eventId: number; actualEarnings: number }) =>
      addEventIncome(payload.eventId, payload.actualEarnings),
    onSuccess: () => {},
    onError: () => {},
  });
};
