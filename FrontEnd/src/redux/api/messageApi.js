import { apiSlice } from "./apiSlice";

export const messageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all conversations for the authenticated user
    getConversations: builder.query({
      query: () => "/messages/conversations",
      providesTags: ["Conversations"],
    }),

    // Get messages for a specific conversation
    getMessages: builder.query({
      query: ({ conversationId }) =>
        `/messages/conversations/${conversationId}`,
      providesTags: (result, error, { conversationId }) => [
        { type: "Messages", id: conversationId },
      ],
    }),

    // Send a new message
    sendMessage: builder.mutation({
      query: ({ recipientId, content }) => ({
        url: "/messages",
        method: "POST",
        body: { recipientId, content },
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: "Messages", id: conversationId },
        "Conversations",
      ],
    }),

    // Mark messages as read
    markAsRead: builder.mutation({
      query: ({ conversationId }) => ({
        url: `/messages/conversations/${conversationId}/read`,
        method: "PUT",
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: "Messages", id: conversationId },
        "Conversations",
      ],
    }),

    // Delete a message
    deleteMessage: builder.mutation({
      query: ({ messageId }) => ({
        url: `/messages/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { conversationId }) => [
        { type: "Messages", id: conversationId },
        "Conversations",
      ],
    }),

    // Get unread message count
    getUnreadCount: builder.query({
      query: () => "/messages/unread",
      providesTags: ["UnreadCount"],
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkAsReadMutation,
  useDeleteMessageMutation,
  useGetUnreadCountQuery,
} = messageApi;
