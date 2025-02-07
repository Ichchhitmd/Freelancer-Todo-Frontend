import { EventRequest, EventResponse } from 'types/eventTypes';
import { del, get, patch, post, put } from './api';

// **Post an Event**
export const postEvent = async (eventData: EventRequest): Promise<EventResponse> => {
  return post<EventResponse>('/events', eventData);
};

// **Get an Event by ID**
export const getEvent = async (userId: number): Promise<EventResponse> => {
  return get<EventResponse>(`/events/user/${userId}`);
};

// **Update an Event**
export const updateEvent = async (
  eventId: number,
  eventData: Partial<EventRequest>
): Promise<EventResponse> => {
  return put<EventResponse>(`/events/${eventId}`, eventData);
};

// **Delete an Event**
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
