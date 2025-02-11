import { post } from './api';
import { SignupData, LoginData, AuthResponse, ChangePasswordData, ChangePasswordResponse } from '../types/authTypes';
import { store } from '../redux/store';

export const signupUser = async (userData: SignupData): Promise<SignupData> => {
  return post<SignupData>('/auth/signup', userData);
};

export const loginUser = async (loginData: LoginData): Promise<AuthResponse> => {
  return post<AuthResponse>('/auth/login', loginData);
};

export const changePassword = async (data: ChangePasswordData): Promise<ChangePasswordResponse> => {
  const token = store.getState().auth.token;

  if (!token) {
    throw new Error('No authentication token available');
  }
  return post<ChangePasswordResponse>('/auth/change-password', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

