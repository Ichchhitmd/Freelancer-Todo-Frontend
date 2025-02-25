import { EventResponse } from 'types/eventTypes';

import { get } from './api';

export const getEventTypes = async (): Promise<EventResponse[]> => {
  return get<EventResponse[]>('/event-categories');
};
