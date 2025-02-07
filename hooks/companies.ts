import { useMutation, useQuery } from '@tanstack/react-query';
import { getCompanies, getCompaniesById, postCompany } from 'helper/companiesRequest';
import { CompanyRequest } from 'types/companiesTypes';

export const useGetCompanies = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies,
  });
};

export const useGetCompaniesById = (id: number) => {
  return useQuery({
    queryKey: ['companies', id],
    queryFn: () => getCompaniesById(id),
  });
};

export const usePostCompanies = () => {
  return useMutation({
    mutationFn: (companyData: CompanyRequest) => postCompany(companyData),
  });
};
