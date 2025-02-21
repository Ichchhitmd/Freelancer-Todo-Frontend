import { useMutation } from '@tanstack/react-query';
import { postExpense } from 'helper/expenseRequest';

export const usePostExpense = () => {
  return useMutation({
    mutationFn: postExpense,
  });
};
