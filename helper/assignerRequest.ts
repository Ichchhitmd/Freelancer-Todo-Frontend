import { get, post } from './api';

export const processAssignerPaymentRequest = async (payload: {
  assignerName: string;
  userId: number;
  amount: number;
}): Promise<any> => {
  const { assignerName, userId, amount } = payload;
  if (!assignerName || !userId || !amount) {
    throw new Error('Invalid payload');
  }
  return post<any>(`/assigners/${assignerName}/users/${userId}/process-payment`, { amount });
};

export const getAllAssigners = async (userId: number): Promise<any> => {
  if (!userId) {
    throw new Error('Invalid userId');
  }
  return get<any>(`/assigners/users/${userId}`);
};

export const fetchTotalAdvancePaid = async (userId: number): Promise<any> => {
  if (!userId) {
    throw new Error('Invalid userId');
  }
  return get<any>(`/assigners/users/${userId}/total-advance`);
};

export const fetchAssignerFinancials = async (
  userId: number,
  assignerName: string
): Promise<any> => {
  if (!userId || !assignerName) {
    throw new Error('Invalid parameters');
  }
  return get<any>(`/assigners/${assignerName}/users/${userId}/financials`);
};
