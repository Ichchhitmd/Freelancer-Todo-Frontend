import { post } from './api';

export const postExpense = async (expenseData: FormData): Promise<any> => {
  return post<any>('/company-expenses', expenseData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
