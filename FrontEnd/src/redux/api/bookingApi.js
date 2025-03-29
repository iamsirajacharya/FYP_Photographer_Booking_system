import { apiSlice } from "./apiSlice";

export const bookingApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
      query: (bookingData) => ({
        url: "/bookings",
        method: "POST",
        body: bookingData,
      }),
      invalidatesTags: ["Booking"],
    }),
    getClientBookings: builder.query({
      query: (params) => ({
        url: "/bookings",
        params,
      }),
      providesTags: ["Booking"],
    }),
    getBookingDetails: builder.query({
      query: (id) => `/bookings/${id}`,
      providesTags: (result, error, id) => [{ type: "Booking", id }],
    }),
    updateBookingStatus: builder.mutation({
      query: ({ id, status, reason }) => ({
        url: `/bookings/${id}/status`,
        method: "PUT",
        body: { status, reason },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Booking", id },
        "Booking",
      ],
    }),
    createReview: builder.mutation({
      query: ({ bookingId, rating, comment }) => ({
        url: `/bookings/${bookingId}/review`,
        method: "POST",
        body: { rating, comment },
      }),
      invalidatesTags: (result, error, { bookingId }) => [
        { type: "Booking", id: bookingId },
        "Review",
        "Booking",
      ],
    }),
    processPayment: builder.mutation({
      query: ({ id, paymentMethod, transactionId }) => ({
        url: `/bookings/${id}/payment`,
        method: "POST",
        body: { paymentMethod, transactionId },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Booking", id },
        "Booking",
      ],
    }),
    getPhotographerBookings: builder.query({
      query: (params) => ({
        url: "/bookings/photographer",
        params,
      }),
      providesTags: ["Booking"],
    }),
    // New endpoint to get all bookings
    getAllBookings: builder.query({
      query: (params) => ({
        url: "/bookings/all",
        params,
      }),
      providesTags: ["Booking"],
    }),
  }),
});

export const {
  useCreateBookingMutation,
  useGetClientBookingsQuery,
  useGetBookingDetailsQuery,
  useUpdateBookingStatusMutation,
  useCreateReviewMutation,
  useProcessPaymentMutation,
  useGetPhotographerBookingsQuery,
  useGetAllBookingsQuery,
} = bookingApi;
