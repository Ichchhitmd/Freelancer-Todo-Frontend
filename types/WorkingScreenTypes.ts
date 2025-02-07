export interface ParsedDate {
  day: number;
  month: string;
  year: number;
  originalDate: string;
  timestamp: number;
}

export interface SimplifiedWorkItem {
  id: string;
  companyId: string;
  companyName: string;
  eventDate: ParsedDate;
  eventType: string;
  side: string;
  workType: string;
  earnings: string;
  isUpcoming: boolean;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  location?: string;
}

export type FilterType = 'upcoming' | 'past' | 'all';
export type SortType = 'date-asc' | 'date-desc' | 'company';
