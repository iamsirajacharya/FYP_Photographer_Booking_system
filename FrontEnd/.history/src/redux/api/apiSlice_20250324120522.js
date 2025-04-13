import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base API slice with shared configuration
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
    prepareHeaders: (headers, { getState }) => {
      // Get token from auth state
      const token = getState().auth.token;

      // If token exists, add authorization header
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["User", "Photographer", "Booking", "Review"],
  endpoints: () => ({}),
});
