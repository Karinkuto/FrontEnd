import { authTokens, userType } from '@/lib/auth';
import type {
  Admin,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '@/types/api';
import { loginSuccess } from '../slices/authSlice';
import { apiSlice } from './apiSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // User Authentication
    loginUser: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/sign_in',
        method: 'POST',
        data: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data, meta } = await queryFulfilled;

          // Check if this is a confirmation email response
          if (
            data?.message?.includes('confirmation') ||
            data?.message?.includes('confirm')
          ) {
            throw new Error(
              'A confirmation email has been sent. Please check your email to confirm your account.'
            );
          }

          // Extract tokens from response headers and store them
          if (meta?.response?.headers) {
            authTokens.set(meta.response.headers);
          }

          // Dispatch login success action
          dispatch(
            loginSuccess({
              user: data.data as User,
              userType: 'user',
            })
          );
        } catch (error) {
          // Re-throw to let the error be handled by the component
          throw error;
        }
      },
    }),

    // Admin Authentication
    loginAdmin: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/Admin_auth/sign_in',
        method: 'POST',
        data: { user: credentials },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data, meta } = await queryFulfilled;

          // Check if this is a confirmation email response
          if (
            data?.message?.includes('confirmation') ||
            data?.message?.includes('confirm')
          ) {
            throw new Error(
              'A confirmation email has been sent. Please check your email to confirm your account.'
            );
          }

          // Extract tokens from response headers and store them
          if (meta?.response?.headers) {
            authTokens.set(meta.response.headers);
          }

          // Dispatch login success action
          dispatch(
            loginSuccess({
              user: data.data as Admin,
              userType: 'admin',
            })
          );
        } catch (error) {
          // Re-throw to let the error be handled by the component
          throw error;
        }
      },
    }),

    // User Registration
    registerUser: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth',
        method: 'POST',
        data: userData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data, meta } = await queryFulfilled;

          // Extract tokens from response headers and store them
          if (meta?.response?.headers) {
            authTokens.set(meta.response.headers);
          }

          // Dispatch login success action
          dispatch(
            loginSuccess({
              user: data.data as User,
              userType: 'user',
            })
          );
        } catch (error) {
          // Error handling is done by the base query
        }
      },
    }),

    // Admin Registration
    registerAdmin: builder.mutation<AuthResponse, RegisterRequest>({
      query: (adminData) => ({
        url: '/Admin_auth',
        method: 'POST',
        data: adminData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data, meta } = await queryFulfilled;

          // Extract tokens from response headers and store them
          if (meta?.response?.headers) {
            authTokens.set(meta.response.headers);
          }

          // Dispatch login success action
          dispatch(
            loginSuccess({
              user: data.data as Admin,
              userType: 'admin',
            })
          );
        } catch (error) {
          // Error handling is done by the base query
        }
      },
    }),

    // User Logout
    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/sign_out',
        method: 'DELETE',
      }),
    }),

    // Admin Logout
    logoutAdmin: builder.mutation<void, void>({
      query: () => ({
        url: '/Admin_auth/sign_out',
        method: 'DELETE',
      }),
    }),

    // Validate Token (both user and admin)
    validateToken: builder.query<AuthResponse, void>({
      query: () => {
        const currentUserType = userType.get();
        const baseUrl = currentUserType === 'admin' ? '/Admin_auth' : '/auth';

        return {
          url: `${baseUrl}/validate_token`,
          method: 'GET',
        };
      },
      providesTags: ['User', 'Admin'],
    }),

    // Password Reset Request
    requestPasswordReset: builder.mutation<
      { message: string },
      { email: string }
    >({
      query: (data) => ({
        url: '/auth/password',
        method: 'POST',
        data,
      }),
    }),

    // Password Reset (with token)
    resetPassword: builder.mutation<
      AuthResponse,
      {
        password: string;
        password_confirmation: string;
        reset_password_token: string;
      }
    >({
      query: (data) => ({
        url: '/auth/password',
        method: 'PUT',
        data,
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useLoginAdminMutation,
  useRegisterUserMutation,
  useRegisterAdminMutation,
  useLogoutUserMutation,
  useLogoutAdminMutation,
  useValidateTokenQuery,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
} = authApi;
