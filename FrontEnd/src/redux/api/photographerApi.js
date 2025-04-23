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
      query: (id) => {
        if (!id) {
          throw new Error("Photographer ID is required");
        }
        return {
          url: `/photographers/${id}`,
          method: "GET",
        };
      },
      transformResponse: (response) => {
        if (!response?.photographer) {
          throw new Error("Photographer data not found");
        }
        return {
          ...response.photographer,
          availability: response.availability || [],
          reviews: response.photographer.reviews || [],
          specialties: response.photographer.specialties || [],
        };
      },
      transformErrorResponse: (response) => {
        console.error("Photographer details API error:", response);
        return {
          status: response.status,
          message:
            response.data?.message || "Failed to fetch photographer details",
        };
      },
      providesTags: (result, error, id) => [{ type: "Photographer", id }],
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
        url: "/photographers/profile/me",
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

    getNearbyPhotographers: builder.query({
      query: (params) => ({
        url: "/photographers/nearby",
        params,
      }),
      transformResponse: (response) => {
        if (!response || !response.photographers) {
          return { photographers: [], totalPhotographers: 0 };
        }
        return response;
      },
      transformErrorResponse: (response) => {
        console.error("Nearby photographers API error:", response);
        return {
          status: response.status,
          data: {
            message:
              response.data?.message || "Failed to fetch nearby photographers",
          },
        };
      },
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