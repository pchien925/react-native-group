import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

// Export types for use in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Create a typed useAppDispatch hook
import { useDispatch } from "react-redux";

export const useAppDispatch = () => useDispatch<AppDispatch>();
