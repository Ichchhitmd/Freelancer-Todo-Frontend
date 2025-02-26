export type FilterType = 'all' | 'upcoming' | 'past';
export type SortType = 'date-desc' | 'date-asc' | 'company';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'PARTIALLY_PAID';

export interface SimplifiedWorkItem {
  id: string | number;
  companyId?: string | number;
  companyName?: string;
  assignedBy?: string;
  assignedContactNumber?: number | null;
  nepaliEventDate: string[];
  isUpcoming: boolean;
  eventType?: string;
  side?: string;
  workType?: string | string[];
  earnings?: string;
  location?: string;
  detailNepaliDate: {
    nepaliDay: number;
    nepaliYear: number;
    nepaliMonth: number;
  }[];
  originalEvent?: WorkEvent;

  statusText: string;
  statusStyle: string;
  daysDifference: number;
  isToday: boolean;
  paymentStatus?: PaymentStatus;
}

export interface WorkEvent {
  eventCategory: any;
  assignedContactNumber: any;
  assignedBy: any;
  paymentStatus?: string;
  eventDate: string[];
  nepaliEventDate: string[];
  detailNepaliDate: {
    nepaliDay: number;
    nepaliYear: number;
    nepaliMonth: number;
  }[];
  dueAmount?: number;
  id: number;
  userId: number;
  companyId?: number;
  contactPerson?: string | null;
  contactInfo?: string | null;
  freelancerId?: number | null;
  eventType?: string;
  side?: string;
  earnings?: string;
  eventStartTime?: string;
  workType?: string[];
  actualEarnings?: number | null;
  clientContactPerson1?: string;
  clientContactNumber1?: string;
  clientContactNumber2?: string;
  venueDetails?: {
    name?: string;
    location?: string;
    photographerFirstPlace?: string;
  };
  clientContactPerson2?: string | null;
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
