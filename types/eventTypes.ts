export interface Contact {
  name: string;
  phoneNumber: string;
  whatsappNumber?: string;
}

export interface SecondaryContact extends Contact {
  relationId: number;
  relationContactNumber: string;
}

export interface VenueDetails {
  location: string;
  name?: string;
  parlourName?: string;
  parlourLocation?: string;
  photographerFirstPlace?: string;
}

export interface NepaliDateDetail {
  nepaliYear: number; // must be >= 2000
  nepaliMonth: number; // must be 1-12
  nepaliDay: number; // must be >= 1
}

export interface EventRequest {
  companyId?: number;
  eventDate: string[];
  nepaliEventDate: string[];
  detailNepaliDate: NepaliDateDetail[];
  eventCategoryId: number;
  side: string;
  earnings: number;
  actualEarnings?: number | null;
  eventStartTime: string;
  workType: string[];
  assignedBy?: string;
  assignedContactNumber?: number | null;
  primaryContact: Contact;
  secondaryContact?: SecondaryContact;
  venueDetails: VenueDetails;
}

export interface EventCategory {
  id: number;
  name: string;
}

export interface Company {
  id: number;
  name: string;
  contactInfo: string;
  contactPerson: string;
  bio: string | null;
}

export interface User {
  id: number;
  name: string;
  phone: string;
}

export interface EventResponse extends EventRequest {
  id: number;
  userId: number;
  freelancerId?: number | null;
  paymentStatus?: string;
  createdAt: string;
  updatedAt: string;
  dueAmount: number;
  user: User;
  company?: Company | null;
  eventCategory?: EventCategory | null;
}

export interface EventDetails {
  id: number;
  eventDate: string[];
  nepaliEventDate: string[];
  eventCategoryId: number;
  side: string;
  earnings: number;
  actualEarnings?: number | null;
  eventStartTime: string;
  workType: string[];
  assignedBy: string;
  assignedContactNumber: string;
  primaryContact: Contact;
  secondaryContact?: SecondaryContact;
  venueDetails: VenueDetails;
  createdAt: string;
  updatedAt: string;
  userId: number;
  companyId?: number;
  company?: Company;
  user: User;
}

export interface EventTypeResponse {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
