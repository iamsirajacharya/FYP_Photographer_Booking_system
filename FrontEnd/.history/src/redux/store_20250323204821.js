import { configureStore, combineReducers } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { apiSlice } from "./api/apiSlice"
import authReducer from "./slices/authSlice"

// Configure Redux Persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // only persist auth state
}

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  auth: authReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE", "persist/REGISTER"],
      },
    }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== "production",
})

export const persistor = persistStore(store)

// Enable refetchOnFocus and refetchOnReconnect
setupListeners(store.dispatch)

