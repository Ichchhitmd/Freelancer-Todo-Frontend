export interface UserState {
  id: number | null;
  name: string;
  email: string;
  phone: string;
  location: string;
  isActive: boolean;
  experience?: string;
  role: string;
}
