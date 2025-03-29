import { apiSlice } from "./apiSlice"

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query({
      query: () => "/users/profile",
      providesTags: ["User"],
    }),
    updateUserProfile: builder.mutation({
      query: (userData) => ({
        url: "/users/profile",
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    updatePassword: builder.mutation({
      query: (passwordData) => ({
        url: "/users/password",
        method: "PUT",
        body: passwordData,
      }),
    }),
    uploadProfileImage: builder.mutation({
      query: (formData) => ({
        url: "/users/profile-image",
        method: "POST",
        body: formData,
        formData: true,
      }),
      invalidatesTags: ["User"],
    }),
    getFavorites: builder.query({
      query: () => "/users/favorites",
      providesTags: ["User"],
    }),
    addFavorite: builder.mutation({
      query: (photographerId) => ({
        url: "/users/favorites",
        method: "POST",
        body: { photographerId },
      }),
      invalidatesTags: ["User"],
    }),
    removeFavorite: builder.mutation({
      query: (photographerId) => ({
        url: `/users/favorites/${photographerId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
})

export const {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useUpdatePasswordMutation,
  useUploadProfileImageMutation,
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = userApi

