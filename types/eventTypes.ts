export interface EventRequest {
  userId: number;
  companyId: number;
  eventDate: string;
  eventType: string;
  workType: string;
  side: string;
  contactPerson: string;
  contactInfo: string;
  earnings: number;
}

export interface EventResponse extends EventRequest {
  id: number;
  eventTime?: string | null;
  createdAt: string;
  updatedAt: string;
  freelancerId?: number | null;
}

export type EventDetails = {
  userId: number;
  companyId: number;
  contactPerson: string;
  contactInfo: string;
  workType: string;
  side: string;
  eventType: string;
  estimatedEarning: number;
  actualEarning?: number;
  eventDate: string;
};
