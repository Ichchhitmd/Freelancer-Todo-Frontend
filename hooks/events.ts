import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteEvent, getEvent, getEventById, patchEvent, postEvent } from 'helper/eventRequest';

export const useEvents = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useGetEvents = (userId: number) => {
  return useQuery({
    queryKey: ['events', userId],
    queryFn: () => getEvent(userId),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 1000 * 60, // Consider data stale after 1 minute
  });
};

export const useGetEventById = (eventId: number) => {
  return useQuery({
    queryKey: ['events', eventId],
    queryFn: () => getEventById(eventId),
  });
};
export const usePatchEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: patchEvent,
    onSuccess: () => {
      queryClient.invalidateQueries(['events']);
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};
