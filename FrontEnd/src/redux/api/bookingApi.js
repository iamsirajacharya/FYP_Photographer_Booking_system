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
    // getClientBookings: builder.query({
    //   query: (params) => ({
    //     url: "/bookings/me",
    //     params,
    //   }),
    //   providesTags: ["Booking"],
    // }),
    getClientBookings: builder.query({
      query: (params) => ({
        url: "/bookings/me",
        params,
      }),
      transformResponse: (response) => response.bookings, // return only the bookings array
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
    processPayment: builder.mutation({
      query: ({ bookingId, paymentMethod, transactionId }) => ({
        url: `/bookings/${bookingId}/payment`,
        method: "POST",
        body: {
          paymentMethod,
          transactionId,
        },
      }),
      invalidatesTags: (result, error, { bookingId }) => [
        { type: "Booking", id: bookingId },
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
  // useCreateReviewMutation,
  useProcessPaymentMutation,
  useGetPhotographerBookingsQuery,
  useGetAllBookingsQuery,
} = bookingApi;
