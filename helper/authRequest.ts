import { post } from './api';
import { store } from '../redux/store';
import {
  SignupData,
  LoginData,
  AuthResponse,
  ChangePasswordData,
  ChangePasswordResponse,
  ForgotPasswordData,
  ForgotPasswordResponse,
  OtpData,
  OtpResponse,
  ResetPasswordData,
  ResetPasswordResponse,
} from '../types/authTypes';

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

export const forgotPassword = async (data: ForgotPasswordData): Promise<ForgotPasswordResponse> => {
  return post<ForgotPasswordResponse>('/users/forgot-password', data);
};

export const verifyOtp = async (data: OtpData): Promise<OtpResponse> => {
  return post<OtpResponse>('/users/verify-otp', data);
};

export const resetPassword = async (data: ResetPasswordData): Promise<ResetPasswordResponse> => {
  return post<ResetPasswordResponse>('/users/reset-password', data);
};
