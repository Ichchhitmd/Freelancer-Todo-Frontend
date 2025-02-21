import { useMutation } from '@tanstack/react-query';
import { postIncome } from 'helper/incomeRequest';

export const usePostIncome = () => {
  return useMutation({
    mutationFn: (payload: { companyId: number; userId: number; amount: number }) =>
      postIncome(payload),
    onSuccess: () => {},
    onError: () => {},
  });
};
