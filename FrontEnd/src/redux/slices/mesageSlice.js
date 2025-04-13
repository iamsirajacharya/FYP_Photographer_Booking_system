import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeConversationId: null,
  unreadCount: 0,
  isTyping: {},
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversationId = action.payload;
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
    resetUnreadCount: (state) => {
      state.unreadCount = 0;
    },
    setTypingStatus: (state, action) => {
      const { userId, isTyping } = action.payload;
      state.isTyping[userId] = isTyping;
    },
  },
});

export const {
  setActiveConversation,
  setUnreadCount,
  incrementUnreadCount,
  resetUnreadCount,
  setTypingStatus,
} = messageSlice.actions;

export default messageSlice.reducer;
