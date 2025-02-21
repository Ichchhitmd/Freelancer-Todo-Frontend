import { FinancialsResponse } from 'types/FinancialTypes';
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
