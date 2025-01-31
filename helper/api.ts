import axios from 'axios';
import { Platform } from 'react-native';

// Function to get the appropriate base URL based on the platform
const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      // Android emulator uses 10.0.2.2
      if (Platform.constants.Release === null) {
        return 'http://10.0.2.2:3000/users';
      }
      // Physical Android device needs your computer's local IP
      return 'http://192.168.1.109:3000/users';
    }
    // iOS simulator and web use localhost
    return 'http://localhost:3000/users';
  }
  // Production API URL (when you deploy)
  return 'https://your-production-api.com/users';
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
  const response = await axios.post(`${API_URL}/signup`, userData);
  return response.data;
};

export const loginUser = async (loginData: { phone: string; password: string; role: string }) => {
  const response = await axios.post(`${API_URL}/login`, loginData);
  return response.data;
};
