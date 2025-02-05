import axios, { AxiosRequestConfig, Method } from 'axios';
import { Platform } from 'react-native';
import { handleAxiosError } from './errorHandling/AxiosErrorHandle';

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

interface ApiRequestConfig extends Omit<AxiosRequestConfig, 'url' | 'method'> {
  data?: any;
  params?: object;
  headers?: object;
}

export const apiRequest = async <T = any>(
  method: Method,
  url: string,
  config: ApiRequestConfig = {}
): Promise<T> => {
  try {
    const { data, params, headers, ...rest } = config;

    const axiosConfig: AxiosRequestConfig = {
      method,
      url: `${API_URL}${url}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...rest,
    };

    // Add data for POST, PUT, PATCH methods
    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && data) {
      axiosConfig.data = data;
    }

    // Add query params for GET, DELETE methods
    if (params) {
      axiosConfig.params = params;
    }

    const response = await axios(axiosConfig);
    return response.data;
  } catch (error: any) {
    throw handleAxiosError(error);
  }

};

export const get = <T = any>(url: string, config?: ApiRequestConfig) =>
  apiRequest<T>('GET', url, config);

export const post = <T = any>(url: string, data?: any, config?: ApiRequestConfig) =>
  apiRequest<T>('POST', url, { ...config, data });

export const put = <T = any>(url: string, data?: any, config?: ApiRequestConfig) =>
  apiRequest<T>('PUT', url, { ...config, data });

export const patch = <T = any>(url: string, data?: any, config?: ApiRequestConfig) =>
  apiRequest<T>('PATCH', url, { ...config, data });

export const del = <T = any>(url: string, config?: ApiRequestConfig) =>
  apiRequest<T>('DELETE', url, config);
