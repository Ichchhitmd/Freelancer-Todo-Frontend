export type FilterType = 'all' | 'upcoming' | 'past';
export type SortType = 'date-desc' | 'date-asc' | 'company';

export interface SimplifiedWorkItem {
  id: string | number;
  companyId: string | number;
  companyName: string;
  nepaliEventDate: string[];
  isUpcoming: boolean;
  eventType: string;
  side: string;
  workType: string | string[];
  earnings: string;
  location?: string;
  detailNepaliDate: Array<{
    nepaliDay: number;
    nepaliYear: number;
    nepaliMonth: number;
  }>;
  originalEvent?: WorkEvent;
  statusText: string;
  statusStyle: string;
  daysDifference: number;
  isToday: boolean;
  
}

export interface WorkEvent {
  eventDate: string[];
  nepaliEventDate: string[];
  detailNepaliDate: Array<{
    nepaliDay: number;
    nepaliYear: number;
    nepaliMonth: number;
  }>;
  dueAmount: number;
  id: number;
  userId: number;
  companyId: number;
  contactPerson: string | null;
  contactInfo: string | null;
  freelancerId: number | null;
  eventType: string;
  side: string;
  earnings: string;
  eventStartTime: string;
  workType: string[];
  actualEarnings: number | null;
  clientContactPerson1: string;
  clientContactNumber1: string;
  clientContactPerson2: string | null;
  clientContactNumber2: string | null;
  location: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    phone: string;
  };
  company: {
    id: number;
    name: string;
    contactInfo: string;
    contactPerson: string;
    bio: string | null;
  };
}
