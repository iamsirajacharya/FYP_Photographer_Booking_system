import { apiSlice } from "./apiSlice";

export const photographerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPhotographers: builder.query({
      query: (params) => ({
        url: "/photographers/all/photographers",
        params,
      }),
      providesTags: ["Photographer"],
    }),
    getPhotographerById: builder.query({
      query: (id) => `/photographers/${id}`,
      providesTags: (result, error, id) => [{ type: "Photographer", id }],
    }),
    getPhotographerPortfolio: builder.query({
      query: (id) => `/photographers/${id}/portfolio`,
      providesTags: (result, error, id) => [{ type: "Photographer", id }],
    }),
    getPhotographerReviews: builder.query({
      query: (id) => `/photographers/${id}/reviews`,
      providesTags: (result, error, id) => [
        { type: "Photographer", id },
        "Review",
      ],
    }),
    getPhotographerAvailability: builder.query({
      query: ({ id, date }) => ({
        url: `/photographers/${id}/availability`,
        params: { date },
      }),
    }),
    applyAsPhotographer: builder.mutation({
      query: (photographerData) => ({
        url: "/photographers/apply",
        method: "POST",
        body: photographerData,
      }),
    }),
    updatePhotographerProfile: builder.mutation({
      query: (photographerData) => ({
        url: "/photographers/profile",
        method: "PUT",
        body: photographerData,
      }),
      invalidatesTags: ["Photographer"],
    }),
    uploadPortfolioImage: builder.mutation({
      query: (formData) => ({
        url: "/photographers/portfolio",
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["Photographer"],
    }),
    deletePortfolioImage: builder.mutation({
      query: (imageId) => ({
        url: `/photographers/portfolio/${imageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Photographer"],
    }),
    updateAvailability: builder.mutation({
      query: (availabilityData) => ({
        url: "/photographers/availability",
        method: "PUT",
        body: availabilityData,
      }),
      invalidatesTags: ["Photographer"],
    }),
  }),
});

export const {
  useGetPhotographersQuery,
  useGetPhotographerByIdQuery,
  useGetPhotographerPortfolioQuery,
  useGetPhotographerReviewsQuery,
  useGetPhotographerAvailabilityQuery,
  useApplyAsPhotographerMutation,
  useUpdatePhotographerProfileMutation,
  useUploadPortfolioImageMutation,
  useDeletePortfolioImageMutation,
  useUpdateAvailabilityMutation,
} = photographerApi;
