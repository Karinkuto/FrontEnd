import { apiSlice } from '@/redux/api/apiSlice';
import type { Booking } from '@/types/api';

export const bookingsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all bookings (admin sees all, user sees own)
    getBookings: builder.query<Booking[], void>({
      query: () => ({
        url: '/bookings',
        method: 'GET',
      }),
      providesTags: ['Booking'],
    }),

    // Get single booking
    getBooking: builder.query<Booking, number>({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),

    // Create booking
    createBooking: builder.mutation<
      Booking,
      { tour_id: number; booking_date: string }
    >({
      query: (bookingData) => ({
        url: '/bookings',
        method: 'POST',
        data: bookingData,
      }),
      invalidatesTags: ['Booking'],
    }),

    // Update booking (admin only)
    updateBooking: builder.mutation<
      Booking,
      { id: number; data: Partial<Booking> }
    >({
      query: ({ id, data }) => ({
        url: `/bookings/${id}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Booking', id }],
    }),

    // Cancel booking
    cancelBooking: builder.mutation<Booking, number>({
      query: (id) => ({
        url: `/bookings/${id}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Booking', id }],
    }),

    // Delete booking (admin only)
    deleteBooking: builder.mutation<void, number>({
      query: (id) => ({
        url: `/bookings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Booking'],
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useGetBookingQuery,
  useCreateBookingMutation,
  useUpdateBookingMutation,
  useCancelBookingMutation,
  useDeleteBookingMutation,
} = bookingsApi;
