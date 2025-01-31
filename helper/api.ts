import axios from 'axios';
import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      if (Platform.constants.Release === null) {
        return 'http://192.168.10.74:3000/users';
      }
      return 'http://192.168.10.74:3000/users';
    }
    return 'http://192.168.10.74:3000/users';
  }
  return 'https://192.168.10.74:3000/users';
};

const API_URL = getBaseUrl();

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
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected Error:', error);
    }
    throw error; // Re-throw the error so it can be handled where the function is called
  }
};

export const loginUser = async (loginData: { phone: string; password: string; role: string }) => {
  try {
    const response = await axios.post(`${API_URL}/login`, loginData);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected Error:', error);
    }
    throw error;
  }
};
