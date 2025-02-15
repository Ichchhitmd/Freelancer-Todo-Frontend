import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteEvent, getEvent, getEventById, patchEvent, postEvent } from 'helper/eventRequest';

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
  return useMutation({
    mutationFn: deleteEvent,
  });
};