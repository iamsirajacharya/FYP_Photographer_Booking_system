import { apiSlice } from "./apiSlice"

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/admin/dashboard",
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
        url: `/admin/users/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Admin", id }, "Admin"],
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
    reviewPhotographerApplication: builder.mutation({
      query: ({ id, status, feedback }) => ({
        url: `/admin/photographers/applications/${id}`,
        method: "PUT",
        body: { status, feedback },
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
    getReports: builder.query({
      query: (params) => ({
        url: "/admin/reports",
        params,
      }),
      providesTags: ["Admin"],
    }),
  }),
})

export const {
  useGetDashboardStatsQuery,
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserStatusMutation,
  useGetAllPhotographersQuery,
  useGetPhotographerApplicationsQuery,
  useReviewPhotographerApplicationMutation,
  useGetAllBookingsQuery,
  useGetReportsQuery,
} = adminApi

