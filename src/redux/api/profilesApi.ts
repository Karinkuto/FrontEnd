import { apiSlice } from '@/redux/api/apiSlice';
import type { Profile } from '@/types/api';

export const profilesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get current user's profile
    getProfile: builder.query<Profile, void>({
      query: () => ({
        url: '/profile',
        method: 'GET',
      }),
      providesTags: ['Profile'],
    }),

    // Create profile
    createProfile: builder.mutation<Profile, Partial<Profile>>({
      query: (profileData) => ({
        url: '/profile',
        method: 'POST',
        data: profileData,
      }),
      invalidatesTags: ['Profile'],
    }),

    // Update profile
    updateProfile: builder.mutation<Profile, Partial<Profile>>({
      query: (profileData) => ({
        url: '/profile',
        method: 'PUT',
        data: profileData,
      }),
      invalidatesTags: ['Profile'],
    }),

    // Get all profiles (admin only)
    getAllProfiles: builder.query<Profile[], void>({
      query: () => ({
        url: '/profiles',
        method: 'GET',
      }),
      providesTags: ['Profile'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useCreateProfileMutation,
  useUpdateProfileMutation,
  useGetAllProfilesQuery,
} = profilesApi;
