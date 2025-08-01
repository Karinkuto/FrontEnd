import { apiSlice } from '@/redux/api/apiSlice';
import type { Review } from '@/types/api';

export const reviewsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get reviews for a specific tour
    getTourReviews: builder.query<Review[], number>({
      query: (tourId) => ({
        url: `/tours/${tourId}/reviews`,
        method: 'GET',
      }),
      providesTags: (result, error, tourId) => [
        { type: 'Review', id: tourId },
        ...(result || []).map(({ id }) => ({ type: 'Review' as const, id })),
      ],
    }),

    // Get single review
    getReview: builder.query<Review, { tourId: number; reviewId: number }>({
      query: ({ tourId, reviewId }) => ({
        url: `/tours/${tourId}/reviews/${reviewId}`,
        method: 'GET',
      }),
      providesTags: (result, error, { reviewId }) => [
        { type: 'Review', id: reviewId },
      ],
    }),

    // Create review
    createReview: builder.mutation<
      Review,
      { tourId: number; rating: number; review_text: string }
    >({
      query: ({ tourId, ...reviewData }) => ({
        url: `/tours/${tourId}/reviews`,
        method: 'POST',
        data: reviewData,
      }),
      invalidatesTags: (result, error, { tourId }) => [
        { type: 'Review', id: tourId },
      ],
    }),

    // Update review
    updateReview: builder.mutation<
      Review,
      {
        tourId: number;
        reviewId: number;
        data: { rating: number; review_text: string };
      }
    >({
      query: ({ tourId, reviewId, data }) => ({
        url: `/tours/${tourId}/reviews/${reviewId}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: (result, error, { tourId, reviewId }) => [
        { type: 'Review', id: tourId },
        { type: 'Review', id: reviewId },
      ],
    }),

    // Delete review
    deleteReview: builder.mutation<void, { tourId: number; reviewId: number }>({
      query: ({ tourId, reviewId }) => ({
        url: `/tours/${tourId}/reviews/${reviewId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { tourId }) => [
        { type: 'Review', id: tourId },
      ],
    }),
  }),
});

export const {
  useGetTourReviewsQuery,
  useGetReviewQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewsApi;
