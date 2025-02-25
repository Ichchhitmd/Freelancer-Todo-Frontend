import { CompanyRequest, CompanyResponse } from 'types/companiesTypes';

import { get, post } from './api';

export const getCompanies = async (): Promise<CompanyResponse[]> => {
  return get<CompanyResponse[]>(`/companies`);
};

export const getCompaniesById = async (id: number): Promise<CompanyResponse> => {
  return get<CompanyResponse>(`/companies/${id}`);
};

export const postCompany = async (companyData: CompanyRequest): Promise<CompanyResponse> => {
  return post<CompanyResponse>('/companies', companyData);
};
