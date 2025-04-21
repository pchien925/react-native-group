// store/slices/cartSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getCartApi,
  createOrderApi,
  updateQuantityApi,
  removeItemFromCartApi,
  addItemToCartApi,
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

// Async thunk để lấy giỏ hàng
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: { accessToken: string | null } };
      const accessToken = state.auth.accessToken;
      if (!accessToken) {
        throw new Error("No access token available");
      }
      const response = await getCartApi();
      if (response.error || !response.data) {
        if (
          response.error &&
          response.error.includes("Current user not found")
        ) {
          await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
          router.replace("/login");
        }
        throw new Error(
          typeof response.error === "string"
            ? response.error
            : Array.isArray(response.error)
            ? response.error.join(", ")
            : response.message || "Failed to fetch cart"
        );
      }
      // Chuyển đổi selectedOptions thành options
      const cart = response.data;
      cart.cartItems = cart.cartItems.map((item: any) => ({
        ...item,
        options: Array.isArray(item.selectedOptions)
          ? item.selectedOptions
          : [],
      }));
      return cart; // ICart
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
      const accessToken = state.auth.accessToken;
      if (!accessToken) {
        throw new Error("No access token available");
      }
      const response = await addItemToCartApi(menuItemId, quantity, options);
      if (response.error || !response.data) {
        if (
          response.error &&
          response.error.includes("Current user not found")
        ) {
          await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
          router.replace("/login");
        }
        throw new Error(
          typeof response.error === "string"
            ? response.error
            : Array.isArray(response.error)
            ? response.error.join(", ")
            : response.message || "Failed to add item to cart"
        );
      }
      // Chuyển đổi selectedOptions thành options
      const cart = response.data;
      cart.cartItems = cart.cartItems.map((item: any) => ({
        ...item,
        options: Array.isArray(item.selectedOptions)
          ? item.selectedOptions
          : [],
      }));
      return cart; // ICart
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
      const accessToken = state.auth.accessToken;
      if (!accessToken) {
        throw new Error("No access token available");
      }
      const response = await updateQuantityApi(cartItemId, quantity);
      if (response.error || !response.data) {
        if (
          response.error &&
          response.error.includes("Current user not found")
        ) {
          await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
          router.replace("/login");
        }
        throw new Error(
          typeof response.error === "string"
            ? response.error
            : Array.isArray(response.error)
            ? response.error.join(", ")
            : response.message || "Failed to update quantity"
        );
      }
      // Chuyển đổi selectedOptions thành options
      const updatedItem = {
        ...response.data,
        options: Array.isArray(response.data.selectedOptions)
          ? response.data.selectedOptions
          : [],
      };
      return updatedItem; // ICartItem
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
      const accessToken = state.auth.accessToken;
      if (!accessToken) {
        throw new Error("No access token available");
      }
      const response = await removeItemFromCartApi(cartItemId);
      if (response.error) {
        if (
          response.error &&
          response.error.includes("Current user not found")
        ) {
          await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
          router.replace("/login");
        }
        throw new Error(
          typeof response.error === "string"
            ? response.error
            : Array.isArray(response.error)
            ? response.error.join(", ")
            : response.message || "Failed to remove item"
        );
      }
      return cartItemId; // Trả về cartItemId để xóa khỏi state
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to remove item");
    }
  }
);

// Async thunk để tạo đơn hàng
export const createOrder = createAsyncThunk(
  "cart/createOrder",
  async (
    orderData: {
      cartId: number;
      shippingAddress: string;
      note: string;
      paymentMethod: "COD" | "VNPAY" | "MOMO" | "BANK_TRANSFER" | "CREDIT_CARD";
      userId: number;
      branchId: number;
    },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as { auth: { accessToken: string | null } };
      const accessToken = state.auth.accessToken;
      if (!accessToken) {
        throw new Error("No access token available");
      }
      const response = await createOrderApi(
        orderData.userId,
        orderData.branchId,
        orderData.shippingAddress,
        orderData.note,
        orderData.paymentMethod
      );
      if (response.error || !response.data) {
        if (
          response.error &&
          response.error.includes("Current user not found")
        ) {
          await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
          router.replace("/login");
        }
        throw new Error(
          typeof response.error === "string"
            ? response.error
            : Array.isArray(response.error)
            ? response.error.join(", ")
            : response.message || "Failed to create order"
        );
      }
      return response.data; // IOrderInfo
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create order");
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(addToCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload; // Cập nhật toàn bộ giỏ hàng
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(updateQuantity.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.cart) {
          state.cart.cartItems = state.cart.cartItems.map((item) =>
            item.id === action.payload.id ? action.payload : item
          );
          state.cart.totalPrice = state.cart.cartItems.reduce(
            (total, item) => total + item.priceAtAddition * item.quantity,
            0
          );
        }
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (state.cart) {
          state.cart.cartItems = state.cart.cartItems.filter(
            (item) => item.id !== action.payload
          );
          state.cart.totalPrice = state.cart.cartItems.reduce(
            (total, item) => total + item.priceAtAddition * item.quantity,
            0
          );
        }
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = null;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
