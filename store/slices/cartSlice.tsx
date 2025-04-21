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
      const response: IBackendResponse<ICart> = await getCartApi();
      if (response.error || !response.data) {
        if (
          response.error &&
          typeof response.error === "string" &&
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
      return response.data; // ICart
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
      const response: IBackendResponse<ICart> = await addItemToCartApi(
        menuItemId,
        quantity,
        options
      );
      if (response.error || !response.data) {
        if (
          response.error &&
          typeof response.error === "string" &&
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
      return response.data; // ICart
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
      const response: IBackendResponse<ICart> = await updateQuantityApi(
        cartItemId,
        quantity
      );
      if (response.error || !response.data) {
        if (
          response.error &&
          typeof response.error === "string" &&
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
      return response.data; // ICart
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
      const response: IBackendResponse<ICart> = await removeItemFromCartApi(
        cartItemId
      );
      if (response.error || !response.data) {
        if (
          response.error &&
          typeof response.error === "string" &&
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
      return response.data; // ICart
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
      const response: IBackendResponse<IOrderInfo> = await createOrderApi(
        orderData.userId,
        orderData.branchId,
        orderData.shippingAddress,
        orderData.note,
        orderData.paymentMethod
      );
      if (response.error || !response.data) {
        if (
          response.error &&
          typeof response.error === "string" &&
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
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cart = action.payload; // action.payload là ICart
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
        state.cart = action.payload; // action.payload là ICart
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
        state.cart = action.payload; // action.payload là ICart
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
        state.cart = action.payload; // action.payload là ICart
        state.error = null;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.status = "succeeded";
        state.cart = null; // Xóa giỏ hàng sau khi tạo đơn hàng
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
