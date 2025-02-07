export interface EventRequest {
  companyId: number;
  eventDate: string;
  eventType: string;
  workType: string;
  side: string;
  contactPerson: string;
  contactInfo: string;
  earnings: number;
  actualEarnings?: number | null;
}

export interface EventResponse extends EventRequest {
  id: number;
  eventTime?: string | null;
  createdAt: string;
  updatedAt: string;
  freelancerId?: number | null;
}

export interface Company {
  bio: string | null;
  contactInfo: string;
  contactPerson: string | null;
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  phone: string;
}

export interface EventDetails {
  actualEarnings: string | null;
  company: Company;
  companyId: number;
  contactInfo: string;
  contactPerson: string;
  createdAt: string;
  earnings: string;
  eventDate: string;
  eventTime: string | null;
  eventType: string;
  freelancerId: number | null;
  id: number;
  side: 'BRIDE' | 'GROOM';
  updatedAt: string;
  user: User;
  userId: number;
  workType: string;
}
