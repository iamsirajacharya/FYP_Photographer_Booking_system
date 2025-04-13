import { apiSlice } from "./apiSlice";

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/admin/dashboard/stats",
      providesTags: ["Admin"],
    }),
    getAllUsers: builder.query({
      query: (params) => ({
        url: "/admin/users",
        params,
      }),
      providesTags: ["Admin"],
    }),
    getUserById: builder.query({
      query: (id) => `/admin/users/${id}`,
      providesTags: (result, error, id) => [{ type: "Admin", id }],
    }),
    updateUserStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/users/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Admin", id },
        "Admin",
      ],
    }),
    getAllPhotographers: builder.query({
      query: (params) => ({
        url: "/admin/photographers",
        params,
      }),
      providesTags: ["Admin"],
    }), 
    getPhotographerApplications: builder.query({
      query: (params) => ({
        url: "/admin/photographers/applications",
        params,
      }),
      providesTags: ["Admin"],
    }),
    approvePhotographerApplication: builder.mutation({
      query: (id) => ({
        url: `/admin/photographers/${id}/approve`,
        method: "PUT",
      }),
      invalidatesTags: ["Admin"],
    }),
    rejectPhotographerApplication: builder.mutation({
      query: (id) => ({
        url: `/admin/photographers/${id}/reject`,
        method: "PUT",
      }),
      invalidatesTags: ["Admin"],
    }),
    getAllBookings: builder.query({
      query: (params) => ({
        url: "/admin/bookings",
        params,
      }),
      providesTags: ["Admin"],
    }),
    updateBookingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/admin/bookings/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Admin"],
    }),
    getReports: builder.query({
      query: (params) => ({
        url: "/admin/reports",
        params,
      }),
      providesTags: ["Admin"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserStatusMutation,
  useGetAllPhotographersQuery,
  useGetPhotographerApplicationsQuery,
  useApprovePhotographerApplicationMutation,
  useRejectPhotographerApplicationMutation,
  useGetAllBookingsQuery,
  useUpdateBookingStatusMutation,
  useGetReportsQuery,
} = adminApi;
