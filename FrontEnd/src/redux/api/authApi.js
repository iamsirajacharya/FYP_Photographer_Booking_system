// src/redux/api/authApi.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/api/auth",
  credentials: "include", // Include cookies if needed
});

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  endpoints: (builder) => ({
    // POST /register
    register: builder.mutation({
      query: (userData) => ({
        url: "/register",
        method: "POST",
        body: userData,
      }),
    }),

    // POST /login
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // POST /logout
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),

    // POST /request-password-reset
    requestPasswordReset: builder.mutation({
      query: (email) => ({
        url: "/request-password-reset",
        method: "POST",
        body: { email },
      }),
    }),

    // POST /reset-password
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: "/reset-password",
        method: "POST",
        body: { token, password },
      }),
    }),

    // POST /refresh-token
    refreshToken: builder.mutation({
      query: () => ({
        url: "/refresh-token",
        method: "POST",
      }),
    }),

    // GET /me (protected route)
    getCurrentUser: builder.query({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
    }),

    // PUT /profile (update user profile)
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: "/profile",
        method: "PUT",
        body: profileData,
      }),
    }),

    // PUT /password (update password)
    updatePassword: builder.mutation({
      query: (passwordData) => ({
        url: "/password",
        method: "PUT",
        body: passwordData,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
} = authApi;
