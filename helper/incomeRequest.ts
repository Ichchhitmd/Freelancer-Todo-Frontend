import { post } from './api';

export const postIncome = async (payload: {
  companyId: number;
  userId: number;
  amount: number;
}): Promise<any> => {
  const { companyId, userId, amount } = payload;

  if (!companyId || !userId || amount === undefined) {
    throw new Error('Invalid payload');
  }

  return post<any>(`/companies/${companyId}/users/${userId}/process-payment`, { amount });
};
