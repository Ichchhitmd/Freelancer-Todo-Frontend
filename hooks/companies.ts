import { useQuery } from '@tanstack/react-query';
import { getCompanies, getCompaniesById } from 'helper/companiesRequest';

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
