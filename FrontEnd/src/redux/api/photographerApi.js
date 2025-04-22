// photographerApi.js
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

    getPhotographerDetails: builder.query({
      query: (id) => ({
        url: `/photographers/${id}`,
        method: "GET",
      }),
      transformResponse: (response) => {
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

    // Updated: Use the reviews endpoint defined in review.routes.js
    getPhotographerReviews: builder.query({
      query: (id) => `/reviews/photographer/${id}`,
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
        url: "/photographers/profile/me", // updated URL to match your router
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

    // Updated getNearbyPhotographers with proper error handling
    getNearbyPhotographers: builder.query({
      query: (params) => ({
        url: "/photographers/nearby",
        params,
      }),
      // Add transformResponse to handle empty results properly
      transformResponse: (response, meta, arg) => {
        // If the response is empty or has no photographers, return an empty array
        if (!response || !response.photographers) {
          return { photographers: [], totalPhotographers: 0 };
        }
        return response;
      },
      // Add transformErrorResponse to handle errors better
      transformErrorResponse: (response) => {
        console.error("Nearby photographers API error:", response);
        // Return a more user-friendly error
        return {
          status: response.status,
          data: {
            message:
              response.data?.message || "Failed to fetch nearby photographers",
          },
        };
      },
      // Add onQueryStarted to log requests for debugging
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Nearby photographers query failed:", error);
        }
      },
    }),

    getPlaceFromCoordinates: builder.query({
      query: (params) => ({
        url: "/photographers/geocode/reverse",
        params,
      }),
      // Add error handling for this endpoint too
      transformErrorResponse: (response) => {
        console.error("Geocoding API error:", response);
        return {
          status: response.status,
          data: {
            message:
              response.data?.message || "Failed to get location information",
          },
        };
      },
    }),
  }),
});

export const {
  useGetPhotographersQuery,
  useGetPhotographerDetailsQuery,
  useGetPhotographerPortfolioQuery,
  useGetPhotographerReviewsQuery,
  useGetPhotographerAvailabilityQuery,
  useApplyAsPhotographerMutation,
  useUpdatePhotographerProfileMutation,
  useUploadPortfolioImageMutation,
  useDeletePortfolioImageMutation,
  useUpdateAvailabilityMutation,
  useBookPhotographerMutation,
  useGetNearbyPhotographersQuery,
  useGetPlaceFromCoordinatesQuery,
} = photographerApi;
