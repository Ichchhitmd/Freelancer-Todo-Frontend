import { useMutation, useQuery } from '@tanstack/react-query';
import { getEvent, postEvent } from 'helper/eventRequest';

export const useEvents = () => {
  return useMutation({
    mutationFn: postEvent,
  });
};

export const useGetEvents = (userId: number) => {
  return useQuery({
    queryKey: ['events', userId],
    queryFn: () => getEvent(userId),
  });
};
