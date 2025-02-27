import { FinancialsResponse, AdvancePaymentResponse } from 'types/FinancialTypes';

import { get } from './api';

export const fetchFinancials = async (
  userId: number,
  companyId: number
): Promise<FinancialsResponse> => {
  if (!userId || !companyId) {
    throw new Error('Invalid parameters');
  }

  return get<FinancialsResponse>(`/companies/${companyId}/users/${userId}/financials`);
};

export const advanceReceipts = async (userId: number): Promise<AdvancePaymentResponse> => {
  if (!userId) {
    throw new Error('Invalid parameters');
  }

  return get<AdvancePaymentResponse>(`/companies/advance-payment/${userId}`);
};
