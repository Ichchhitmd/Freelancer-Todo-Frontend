import { DataSummary } from 'types/earningsTypes';
import { get } from './api';

export const fetchEarnings = async (id: number): Promise<DataSummary> => {
  return get<DataSummary>(`/events/comprehensive-earnings/${id}`);
};
