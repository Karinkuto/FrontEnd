import Cookies from 'js-cookie';
import type { AuthTokens } from '@/types/api';

// Cookie configuration
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
};

// Token management
export const authTokens = {
  // Get all auth tokens
  get(): AuthTokens | null {
    const accessToken = Cookies.get('access-token');
    const client = Cookies.get('client');
    const uid = Cookies.get('uid');

    if (!(accessToken && client && uid)) {
      return null;
    }

    return {
      'access-token': accessToken,
      client,
      uid,
    };
  },

  // Set auth tokens from response headers
  set(headers: Headers | Record<string, string>): void {
    const getHeader = (name: string): string | null => {
      if (headers instanceof Headers) {
        return headers.get(name);
      }
      return headers[name] || null;
    };

    const accessToken = getHeader('access-token');
    const client = getHeader('client');
    const uid = getHeader('uid');

    if (accessToken && client && uid) {
      Cookies.set('access-token', accessToken, COOKIE_OPTIONS);
      Cookies.set('client', client, COOKIE_OPTIONS);
      Cookies.set('uid', uid, COOKIE_OPTIONS);
    }
  },

  // Clear all auth tokens
  clear(): void {
    Cookies.remove('access-token');
    Cookies.remove('client');
    Cookies.remove('uid');
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.get() !== null;
  },
};

// User type management
export const userType = {
  get(): 'user' | 'admin' | null {
    return Cookies.get('user-type') as 'user' | 'admin' | null;
  },

  set(type: 'user' | 'admin'): void {
    Cookies.set('user-type', type, COOKIE_OPTIONS);
  },

  clear(): void {
    Cookies.remove('user-type');
  },

  isAdmin(): boolean {
    return this.get() === 'admin';
  },

  isUser(): boolean {
    return this.get() === 'user';
  },
};

// Auth headers for API requests
export const getAuthHeaders = (): Record<string, string> => {
  const tokens = authTokens.get();
  if (!tokens) return {};

  return {
    'access-token': tokens['access-token'],
    client: tokens.client,
    uid: tokens.uid,
  };
};

// Complete logout
export const logout = (): void => {
  authTokens.clear();
  userType.clear();
};
