import { createSlice } from "@reduxjs/toolkit";

const auth = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = auth.actions;
export default auth.reducer;
