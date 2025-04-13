// reviewApi.js
import { createSlice } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";

// API endpoints for reviews
export const reviewApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get reviews for a photographer
    getPhotographerReviews: builder.query({
      query: (photographerId) => `/reviews/photographer/${photographerId}`,
      providesTags: (result, error, photographerId) => [
        { type: "Reviews", id: photographerId },
      ],
    }),

    // Get reviews by a user
    getUserReviews: builder.query({
      query: (userId) => `/reviews/user/${userId}`,
      providesTags: (result, error, userId) => [
        { type: "UserReviews", id: userId },
      ],
    }),

    // // Create a new review, including bookingId if available
    // createReview: builder.mutation({
    //   query: (reviewData) => ({
    //     url: "/reviews", // endpoint URL as defined in your backend routes
    //     method: "POST",
    //     body: {
    //       ...reviewData,
    //       // Ensure bookingId is included if present, otherwise it can be null
    //       bookingId: reviewData.bookingId || null,
    //     },
    //   }),
    //   invalidatesTags: (result, error, { photographerId }) => [
    //     { type: "Reviews", id: photographerId },
    //     { type: "UserReviews", id: "LIST" },
    //   ],
    // }),

    createReview: builder.mutation({
      query: (reviewData) => {
        // Omit bookingId from the payload
        const { bookingId, ...data } = reviewData;
        return {
          url: "/reviews",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: (result, error, { photographerId }) => [
        { type: "Reviews", id: photographerId },
        { type: "UserReviews", id: "LIST" },
      ],
    }),

    // Update a review
    updateReview: builder.mutation({
      query: ({ reviewId, ...reviewData }) => ({
        url: `/reviews/${reviewId}`,
        method: "PUT",
        body: reviewData,
      }),
      invalidatesTags: (result, error, { photographerId }) => [
        { type: "Reviews", id: photographerId },
        { type: "UserReviews", id: "LIST" },
      ],
    }),

    // Delete a review
    deleteReview: builder.mutation({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reviews", "UserReviews"],
    }),
  }),
});

// Export the generated hooks
export const {
  useGetPhotographerReviewsQuery,
  useGetUserReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApiSlice;

// Review slice for local state management
const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    reviewFormOpen: false,
    // Store the bookingId associated with the review (if applicable)
    selectedBookingId: null,
    reviewDraft: {
      rating: 0,
      comment: "",
      // Optionally include bookingId in the draft if you prefer to use it directly from here
      bookingId: null,
    },
  },
  reducers: {
    openReviewForm: (state, action) => {
      // Action payload should include the bookingId for the review and any other necessary data (like photographerId)
      state.reviewFormOpen = true;
      state.selectedBookingId = action.payload.bookingId;
      state.reviewDraft = {
        rating: 0,
        comment: "",
        bookingId: action.payload.bookingId,
      };
    },
    closeReviewForm: (state) => {
      state.reviewFormOpen = false;
      state.selectedBookingId = null;
      state.reviewDraft = { rating: 0, comment: "", bookingId: null };
    },
    setReviewRating: (state, action) => {
      state.reviewDraft.rating = action.payload;
    },
    setReviewComment: (state, action) => {
      state.reviewDraft.comment = action.payload;
    },
  },
});

export const {
  openReviewForm,
  closeReviewForm,
  setReviewRating,
  setReviewComment,
} = reviewSlice.actions;

export default reviewSlice.reducer;
