// store/slices/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUserApi, loginApi } from "@/services/api";

// Định nghĩa trạng thái cho auth
interface AuthState {
  user: IUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  status: "idle",
  error: null,
};

// Async thunk để đăng nhập
export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response: IBackendResponse<ILoginResponse> = await loginApi(
        credentials.email,
        credentials.password
      );
      console.log("Login credentials:", credentials.email);
      console.log("Login response:", response);

      if (response.error || !response.data) {
        throw new Error(
          typeof response.error === "string"
            ? response.error
            : Array.isArray(response.error)
            ? response.error.join(", ")
            : response.message || "Failed to login"
        );
      }
      // Kiểm tra và lưu token vào AsyncStorage
      const { accessToken, refreshToken } = response.data;
      if (accessToken && refreshToken) {
        await AsyncStorage.multiSet([
          ["accessToken", accessToken],
          ["refreshToken", refreshToken],
        ]);
      } else {
        throw new Error("Invalid login response: Missing tokens");
      }
      return response.data; // ILoginResponse: { accessToken, refreshToken, userId }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to login");
    }
  }
);

// Async thunk để lấy thông tin người dùng hiện tại
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const accessToken = state.auth.accessToken;
      if (!accessToken) {
        throw new Error("No access token available");
      }
      const response: IBackendResponse<IUser> = await getCurrentUserApi();
      if (response.error || !response.data) {
        // Xóa token nếu lỗi là "Current user not found"
        if (
          response.error &&
          response.error.includes("Current user not found")
        ) {
          await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
        }
        throw new Error(
          typeof response.error === "string"
            ? response.error
            : Array.isArray(response.error)
            ? response.error.join(", ")
            : response.message || "Failed to fetch user"
        );
      }
      return response.data; // IUser
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch user");
    }
  }
);

// Async thunk để đăng xuất
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
      return true;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to logout");
    }
  }
);

// Async thunk để kiểm tra trạng thái xác thực
export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      if (accessToken) {
        await dispatch(getCurrentUser()).unwrap();
        return accessToken;
      }
      return null;
    } catch (error: any) {
      // Xóa token nếu lỗi là "Current user not found"
      if (error.message && error.message.includes("Current user not found")) {
        await AsyncStorage.multiRemove(["accessToken", "refreshToken"]);
      }
      return rejectWithValue(error.message || "Failed to check auth");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(getCurrentUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(logout.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = "idle";
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(checkAuth.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.status = action.payload ? "succeeded" : "idle";
        state.accessToken = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { resetAuth } = authSlice.actions;
export default authSlice.reducer;
