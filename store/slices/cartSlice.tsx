import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getCartApi,
  addItemToCartApi,
  updateItemQuantityApi,
  removeItemFromCartApi,
  clearCartApi,
} from "@/services/api";
import { router } from "expo-router";

interface CartState {
  cart: ICart | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  status: "idle",
  error: null,
};

// Helper function to format error message
const formatErrorMessage = (
  error: string | string[] | undefined,
  defaultMessage: string
): string => {
  if (Array.isArray(error)) return error.join(", ");
  return error || defaultMessage;
};

// Async thunk để lấy giỏ hàng
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { accessToken: string | null } };
      if (!state.auth.accessToken) throw new Error("No access token");
      const response = await getCartApi();
      if (response.error || !response.data) {
        if (
          typeof response.error === "string" &&
          response.error.includes("Current user not found")
        ) {
          await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
          router.replace("/login");
        }
        throw new Error(
          formatErrorMessage(response.error, "Failed to fetch cart")
        );
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch cart");
    }
  }
);

// Async thunk để thêm mục vào giỏ hàng
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    {
      menuItemId,
      quantity,
      options,
    }: { menuItemId: number; quantity: number; options: IOptionValue[] },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { auth: { accessToken: string | null } };
      if (!state.auth.accessToken) throw new Error("No access token");
      const response = await addItemToCartApi(menuItemId, quantity, options);
      if (response.error || !response.data) {
        if (
          typeof response.error === "string" &&
          response.error.includes("Current user not found")
        ) {
          await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
          router.replace("/login");
        }
        throw new Error(
          formatErrorMessage(response.error, "Failed to add item to cart")
        );
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add item to cart");
    }
  }
);

// Async thunk để cập nhật số lượng
export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async (
    { cartItemId, quantity }: { cartItemId: number; quantity: number },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { auth: { accessToken: string | null } };
      if (!state.auth.accessToken) throw new Error("No access token");
      const response = await updateItemQuantityApi(cartItemId, quantity);
      if (response.error || !response.data) {
        if (
          typeof response.error === "string" &&
          response.error.includes("Current user not found")
        ) {
          await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
          router.replace("/login");
        }
        throw new Error(
          formatErrorMessage(response.error, "Failed to update quantity")
        );
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update quantity");
    }
  }
);

// Async thunk để xóa mục khỏi giỏ hàng
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (cartItemId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { accessToken: string | null } };
      if (!state.auth.accessToken) throw new Error("No access token");
      const response = await removeItemFromCartApi(cartItemId);
      if (response.error || !response.data) {
        if (
          typeof response.error === "string" &&
          response.error.includes("Current user not found")
        ) {
          await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
          router.replace("/login");
        }
        throw new Error(
          formatErrorMessage(response.error, "Failed to remove item")
        );
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to remove item");
    }
  }
);

// Async thunk để xóa toàn bộ giỏ hàng
export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { accessToken: string | null } };
      if (!state.auth.accessToken) throw new Error("No access token");
      const response = await clearCartApi();
      if (response.error || !response.data) {
        if (
          typeof response.error === "string" &&
          response.error.includes("Current user not found")
        ) {
          await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
          router.replace("/login");
        }
        throw new Error(
          formatErrorMessage(response.error, "Failed to clear cart")
        );
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to clear cart");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    resetCart: (state) => {
      state.cart = null;
      state.status = "idle";
      state.error = null;
    },
    sortCartItemsById: (state) => {
      if (state.cart?.cartItems) {
        state.cart.cartItems = [...state.cart.cartItems].sort(
          (a, b) => a.id - b.id
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload;
        // Sắp xếp ngay sau khi fetch
        if (state.cart?.cartItems) {
          state.cart.cartItems = [...state.cart.cartItems].sort(
            (a, b) => a.id - b.id
          );
        }
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload;
        // Sắp xếp sau khi thêm
        if (state.cart?.cartItems) {
          state.cart.cartItems = [...state.cart.cartItems].sort(
            (a, b) => a.id - b.id
          );
        }
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Update Quantity
      .addCase(updateQuantity.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload;
        // Sắp xếp sau khi cập nhật số lượng
        if (state.cart?.cartItems) {
          state.cart.cartItems = [...state.cart.cartItems].sort(
            (a, b) => a.id - b.id
          );
        }
        state.error = null;
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload;
        // Sắp xếp sau khi xóa
        if (state.cart?.cartItems) {
          state.cart.cartItems = [...state.cart.cartItems].sort(
            (a, b) => a.id - b.id
          );
        }
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.status = "succeeded";
        state.cart = null;
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { resetCart, sortCartItemsById } = cartSlice.actions;
export default cartSlice.reducer;
