import { useMutation } from '@tanstack/react-query';
import { postIncome } from 'helper/incomeRequest';

export const usePostIncome = () => {
  return useMutation({
    mutationFn: (payload: { companyId: string; userId: string; amount: number }) =>
      postIncome(payload),
    onSuccess: () => {},
    onError: () => {},
  });
};
