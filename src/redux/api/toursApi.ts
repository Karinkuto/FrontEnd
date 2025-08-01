import { apiSlice } from '@/redux/api/apiSlice';
import type { Category, Tour } from '@/types/api';

export const toursApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all tours
    getTours: builder.query<Tour[], void>({
      query: () => ({
        url: '/tours',
        method: 'GET',
      }),
      providesTags: ['Tour'],
    }),

    // Get single tour
    getTour: builder.query<Tour, number>({
      query: (id) => ({
        url: `/tours/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Tour', id }],
    }),

    // Create tour (admin only)
    createTour: builder.mutation<Tour, Partial<Tour>>({
      query: (tourData) => ({
        url: '/tours',
        method: 'POST',
        data: tourData,
      }),
      invalidatesTags: ['Tour'],
    }),

    // Update tour (admin only)
    updateTour: builder.mutation<Tour, { id: number; data: Partial<Tour> }>({
      query: ({ id, data }) => ({
        url: `/tours/${id}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Tour', id }],
    }),

    // Delete tour (admin only)
    deleteTour: builder.mutation<void, number>({
      query: (id) => ({
        url: `/tours/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tour'],
    }),

    // Get all categories
    getCategories: builder.query<Category[], void>({
      query: () => ({
        url: '/categories',
        method: 'GET',
      }),
      providesTags: ['Category'],
    }),

    // Create category (admin only)
    createCategory: builder.mutation<Category, Partial<Category>>({
      query: (categoryData) => ({
        url: '/categories',
        method: 'POST',
        data: categoryData,
      }),
      invalidatesTags: ['Category'],
    }),

    // Update category (admin only)
    updateCategory: builder.mutation<
      Category,
      { id: number; data: Partial<Category> }
    >({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: 'PUT',
        data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }],
    }),

    // Delete category (admin only)
    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
  }),
});

export const {
  useGetToursQuery,
  useGetTourQuery,
  useCreateTourMutation,
  useUpdateTourMutation,
  useDeleteTourMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = toursApi;
