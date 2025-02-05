import { useQuery } from '@tanstack/react-query';
import { getCompanies } from 'helper/companiesRequest';

export const useGetCompanies = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies,
  });
};
