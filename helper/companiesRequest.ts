import { Company } from 'types/companiesTypes';

import { get } from './api';

export const getCompanies = async (): Promise<Company[]> => {
  return get<Company[]>(`/companies/`);
};
