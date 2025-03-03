export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  role: string;
  location: string;
  experience?: string;
  isActive: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
  location?: string;
  photo?: string;
  experience?: string;
  role?: string;
  isActive?: boolean;
  message?: string;
  error?: string;
}

export interface LoginData {
  phone: string;
  password: string;
  role: string;
}

export interface Token {
  access_token: string;
}

export interface AuthResponse {
  token: Token;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
}

