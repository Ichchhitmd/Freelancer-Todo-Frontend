import { apiRequest } from './api';

export const signupUser = async (userData: {
  name: string;
  email: string;
  phone: string;
  password: string;
  location: string;
  experience?: string;
  role?: string;
  isActive?: boolean;
}) => {
  return await apiRequest('/auth/signup', userData);
};

export const loginUser = async (loginData: { phone: string; password: string; role: string }) => {
  return await apiRequest('/auth/login', loginData);
};
