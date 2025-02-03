import axios from 'axios';
import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return Platform.constants.Release === null
        ? process.env.BASE_URL_ANDROID_SIM
        : process.env.BASE_URL_ANDROID_DEV;
    }
    return process.env.BASE_URL_IOS_DEV;
  }
  return Platform.OS === 'android'
    ? process.env.BASE_URL_ANDROID_PROD
    : process.env.BASE_URL_IOS_PROD;
};

const API_URL = getBaseUrl();

export const apiRequest = async (url: string, data: object) => {
  try {
    const response = await axios.post(`${API_URL}${url}`, data);
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
