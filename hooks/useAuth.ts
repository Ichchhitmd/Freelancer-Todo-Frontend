import { useMutation } from '@tanstack/react-query';
import { loginUser, signupUser } from 'helper/api';

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
