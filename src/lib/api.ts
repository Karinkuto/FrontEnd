import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { authTokens, logout } from '@/lib/auth';
import type { RootState } from '@/redux/store';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: Number(process.env.NEXT_PUBLIC_API_TIMEOUT),
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Response interceptor to handle DeviseTokenAuth tokens and errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Update auth tokens from response headers (DeviseTokenAuth pattern)
    if (response.headers) {
      authTokens.set(response.headers);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Clear invalid tokens and redirect will be handled by error handler below
    }

    return Promise.reject(error);
  }
);

type AxiosBaseQueryArgs = {
  url: string;
  method: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
  headers?: AxiosRequestConfig['headers'];
  responseType?: AxiosRequestConfig['responseType'];
};

// Define the error shape
type AxiosBaseQueryError = {
  status: number;
  data: unknown;
};

// Define the meta type with getState
type AxiosBaseQueryMeta = {
  getState: () => RootState;
};

export const axiosBaseQuery =
  (): BaseQueryFn<
    AxiosBaseQueryArgs,
    unknown,
    AxiosBaseQueryError,
    unknown,
    AxiosBaseQueryMeta
  > =>
  async (args, { getState, dispatch }) => {
    const { url, method, data, params, headers, responseType } = args;

    // Get DeviseTokenAuth tokens
    const tokens = authTokens.get();

    try {
      const result = await api({
        url,
        method,
        data,
        params,
        headers: {
          ...headers,
          // Add DeviseTokenAuth headers if tokens exist
          ...(tokens && {
            'access-token': tokens['access-token'],
            client: tokens.client,
            uid: tokens.uid,
          }),
        },
        responseType: responseType || 'json',
      });

      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;

      // Handle 401 Unauthorized
      if (err.response?.status === 401) {
        const responseData = err.response?.data as any;
        const isConfirmationCase =
          responseData?.message?.includes?.('confirmation') ||
          responseData?.message?.includes?.('confirm') ||
          responseData?.errors?.some?.(
            (e: string) => e.includes('confirmation') || e.includes('confirm')
          );

        if (!isConfirmationCase) {
          // Clear tokens and logout only if not a confirmation case
          logout();
        }
      }

      return {
        error: {
          status: err.response?.status ?? 500,
          data: err.response?.data ?? err.message,
        },
      };
    }
  };
