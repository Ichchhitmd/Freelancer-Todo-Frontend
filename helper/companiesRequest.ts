import { Company } from 'types/companiesTypes';
import { get } from './api';

export const getCompanies = async (): Promise<Company[]> => {
  return get<Company[]>(`/companies/`);
};

export const getCompaniesById = async (id: number): Promise<Company> => {
  return get<Company>(`/companies/${id}`);
};