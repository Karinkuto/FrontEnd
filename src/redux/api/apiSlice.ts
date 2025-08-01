import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/lib/api';

// Define a service using a base URL and expected endpoints
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: [
    'User',
    'Admin',
    'Profile',
    'Tour',
    'Category',
    'Booking',
    'Review',
    'TourDate',
    'Price',
    'Destination',
    'Activity',
    'Cancellation',
  ],
  endpoints: (builder) => ({}),
});

// Export hooks for usage in functional components
export const {} = apiSlice;
