import { useMutation, useQuery } from '@tanstack/react-query';
import { getEvent, patchEvent, postEvent } from 'helper/eventRequest';

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

export const usePatchEvent = () => {
  return useMutation({
    mutationFn: patchEvent,
  });
};