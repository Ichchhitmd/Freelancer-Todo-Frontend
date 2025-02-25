export interface Company {
  id: number;
  name: string;
  bio: string;
  contactInfo: string;
  contactPerson: string;
  location?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyResponse {
  id: number;
  name: string;
  bio?: string;
  contactInfo?: string;
  contactPerson?: string;
  location?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompanyRequest {
  name: string;
  contactInfo: string;
  contactPerson: string;
  location?: string;
  imageUrl?: string;
}
