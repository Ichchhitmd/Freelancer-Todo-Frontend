import axios, { AxiosRequestConfig, Method } from 'axios';
import { Platform } from 'react-native';
import { handleAxiosError } from './errorHandling/AxiosErrorHandle';

const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return Platform.Version ? process.env.BASE_URL_ANDROID_DEV : process.env.BASE_URL_ANDROID_SIM;
    }
    return process.env.BASE_URL_IOS_DEV;
  }
  return Platform.OS === 'android'
    ? process.env.BASE_URL_ANDROID_PROD
    : process.env.BASE_URL_IOS_PROD;
};

const API_URL = getBaseUrl();

interface Headers {
  'Content-Type'?: string;
  [key: string]: string | undefined;
}

interface ApiRequestConfig extends Omit<AxiosRequestConfig, 'url' | 'method'> {
  data?: any;
  params?: object;
  headers?: Headers;
}

export const apiRequest = async <T = any>(
  method: Method,
  url: string,
  config: ApiRequestConfig = {}
): Promise<T> => {
  try {
    const { data, params, headers = {} as Headers, ...rest } = config;

    const axiosConfig: AxiosRequestConfig = {
      baseURL: API_URL,
      method,
      url,
      headers: {
        'Content-Type': headers['Content-Type'] || 'application/json',
        ...headers,
      },
      ...rest,
    };

    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && data) {
      axiosConfig.data = data;
    } else if (method.toUpperCase() === 'GET' && data) {
      console.warn(`GET request should not have a body. Ignoring 'data' in ${url}`);
    }

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
