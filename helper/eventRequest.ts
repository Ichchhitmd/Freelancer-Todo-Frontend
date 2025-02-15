import { EventRequest, EventResponse } from 'types/eventTypes';
import { del, get, patch, post, put } from './api';

export const postEvent = async (eventData: EventRequest): Promise<EventResponse> => {
  return post<EventResponse>('/events', eventData);
};

export const getEvent = async (userId: number): Promise<EventResponse> => {
  return get<EventResponse>(`/events/user/${userId}`);
};

export const getEventById = async (eventId: number): Promise<EventResponse> => {
  return get<EventResponse>(`/events/${eventId}`);
};

export const updateEvent = async (
  eventId: number,
  eventData: Partial<EventRequest>
): Promise<EventResponse> => {
  return put<EventResponse>(`/events/${eventId}`, eventData);
};

export const deleteEvent = async (eventId: number): Promise<void> => {
  return del<void>(`/events/${eventId}`);
};

export const patchEvent = async ({
  eventId,
  eventData,
}: {
  eventId: number;
  eventData: Partial<EventRequest>;
}): Promise<EventResponse> => {
  const response = await patch<EventResponse>(`/events/${eventId}`, eventData);
  return response;
};
