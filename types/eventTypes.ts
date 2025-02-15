export interface EventRequest {
  companyId?: number;
  eventDate: string[];
  nepaliEventDate: string[];
  detailNepaliDate: { nepaliYear: number; nepaliMonth: number; nepaliDay: number }[];
  eventType: string;
  side: string;
  dueAmount?: number;
  earnings: number;
  eventStartTime: string;
  workType: string[];
  clientContactPerson1: string;
  clientContactNumber1: string;
  clientContactPerson2?: string | null;
  clientContactNumber2?: string | null;
  location: string;
  actualEarnings?: number | null; // Matches the example nullability
}

export interface EventResponse extends EventRequest {
  id: number;
  userId: number;
  freelancerId?: number | null;
  contactPerson?: string | null;
  contactInfo?: string | null;
  createdAt: string;
  updatedAt: string;
  dueAmount: number;
}

export interface Company {
  id: number;
  name: string;
  contactInfo: string;
  contactPerson: string | null;
  bio: string | null;
}

export interface User {
  id: number;
  name: string;
  phone: string;
}

export interface EventDetails {
  id: number;
  eventDate: string[];
  nepaliEventDate: string[];
  detailNepaliDate: {
    nepaliYear: number;
    nepaliMonth: number;
    nepaliDay: number;
  }[];
  dueAmount: number;
  earnings: string;
  actualEarnings: string | null;
  eventStartTime: string;
  workType: string[];
  clientContactPerson1: string;
  clientContactNumber1: string;
  clientContactPerson2?: string | null;
  clientContactNumber2?: string | null;
  location: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  companyId: number;
  contactPerson?: string | null;
  contactInfo?: string | null;
  side: 'BRIDE' | 'GROOM';
  eventType: string;
  freelancerId?: number | null;
  company: Company;
  user: User;
}
