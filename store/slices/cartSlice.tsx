import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sampleCart } from "@/data/cartData";

// Interfaces
export interface IMenuItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  basePrice: number;
}

export interface IOptionValue {
  id: number;
  value: string;
  additionalPrice: number;
}

export interface ICartItem {
  id: number;
  quantity: number;
  priceAtAddition: number;
  menuItem: IMenuItem;
  options: IOptionValue[];
}

export interface ICart {
  id: number;
  cartItems: ICartItem[];
  totalPrice: number;
}

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

// Async thunks for API simulation
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return sampleCart;
    } catch (error: any) {
      return rejectWithValue("Failed to fetch cart");
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (cartItem: ICartItem, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Simulate adding to cart (update state in reducer)
      return { ...sampleCart, cartItems: [...sampleCart.cartItems, cartItem] };
    } catch (error: any) {
      return rejectWithValue("Failed to add item to cart");
    }
  }
);

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async (
    { cartItemId, quantity }: { cartItemId: number; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Simulate updating quantity
      const updatedItems = sampleCart.cartItems.map((item) =>
        item.id === cartItemId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      );
      const newTotalPrice = updatedItems.reduce(
        (sum, item) => sum + item.priceAtAddition * item.quantity,
        0
      );
      return {
        ...sampleCart,
        cartItems: updatedItems,
        totalPrice: newTotalPrice,
      };
    } catch (error: any) {
      return rejectWithValue("Failed to update quantity");
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (cartItemId: number, { rejectWithValue }) => {
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Simulate removing item
      const updatedItems = sampleCart.cartItems.filter(
        (item) => item.id !== cartItemId
      );
      const newTotalPrice = updatedItems.reduce(
        (sum, item) => sum + item.priceAtAddition * item.quantity,
        0
      );
      return {
        ...sampleCart,
        cartItems: updatedItems,
        totalPrice: newTotalPrice,
      };
    } catch (error: any) {
      return rejectWithValue("Failed to remove item from cart");
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
        state.cart = action.payload;
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
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { resetCart } = cartSlice.actions;
export default cartSlice.reducer;
