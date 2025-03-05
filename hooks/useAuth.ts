import { useMutation } from '@tanstack/react-query';
import {
  forgotPassword,
  loginUser,
  resetPassword,
  signupUser,
  verifyOtp,
} from 'helper/authRequest';

export const useSignup = () => {
  return useMutation({
    mutationFn: signupUser,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
  });
};

export const useVerifyOtp = () => {
  return useMutation({
    mutationFn: verifyOtp,
  });
};

export const useResendOtp = () => {
  return useMutation({
    mutationFn: forgotPassword,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};
