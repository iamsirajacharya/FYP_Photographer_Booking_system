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
    // getPhotographerById: builder.query({
    //   query: (id) => `/photographers/${id}`,
    //   providesTags: (result, error, id) => [{ type: "Photographer", id }],
    // }),

    // getPhotographerById: builder.query({
    //   query: (id) => `/photographers/${id}`,
    //   transformResponse: (response) => response.photographer, // Now the hook returns the photographer directly
    //   providesTags: (result, error, id) => [{ type: "Photographer", id }],
    // }),

    getPhotographerDetails: builder.query({
      query: (id) => ({
        url: `photographers/${id}`,
        method: "GET",
      }),
      transformResponse: (response) => {
        // Transform the response to ensure all fields are present
        return {
          ...response.photographer,
          availability: response.availability,
          reviews: response.photographer.reviews || [],
          specialties: response.photographer.specialties || [],
        };
      },
    }),
    bookPhotographer: builder.mutation({
      query: (bookingData) => ({
        url: "/bookings",
        method: "POST",
        body: bookingData,
      }),
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
      // Invalidate the Photographer tag so any cached data is refreshed
      invalidatesTags: ["Photographer"],
    }),
  }),
});

export const {
  useGetPhotographersQuery,
  // useGetPhotographerByIdQuery,
  useGetPhotographerDetailsQuery,
  useGetPhotographerPortfolioQuery,
  useGetPhotographerReviewsQuery,
  useGetPhotographerAvailabilityQuery,
  useApplyAsPhotographerMutation,
  useUpdatePhotographerProfileMutation,
  useUploadPortfolioImageMutation,
  useDeletePortfolioImageMutation,
  useUpdateAvailabilityMutation,
} = photographerApi;
