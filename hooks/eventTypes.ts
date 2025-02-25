import { useQuery } from '@tanstack/react-query';
import { getEventTypes } from 'helper/fetchEventTypes';

export const useGetEventTypes = () => {
  return useQuery({
    queryKey: ['event-types'],
    queryFn: getEventTypes,
  });
};
