import { post } from './api';

export const postIncome = async (payload: {
  companyId: string;
  userId: string;
  amount: number;
}): Promise<any> => {
  const { companyId, userId, amount } = payload;

  if (!companyId || !userId || amount === undefined) {
    throw new Error('Invalid payload');
  }

  const submissionPayload = {
    amount: amount.toString(),
  };

  return post<any>(`/companies/${companyId}/users/${userId}/process-payment`, submissionPayload);
};
