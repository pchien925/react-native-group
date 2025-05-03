// store/slices/notificationSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getNotificationsApi, markNotificationAsReadApi } from "@/services/api";

interface NotificationState {
  notifications: INotification[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  currentPage: 1,
  totalPages: 1,
  totalElements: 0,
  status: "idle",
  error: null,
};

// Async thunk để lấy danh sách thông báo
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (
    {
      userId,
      page = 1,
      size = 10,
      sort = "id",
      direction = "desc",
      isLoadMore = false,
    }: {
      userId: number;
      page?: number;
      size?: number;
      sort?: string;
      direction?: string;
      isLoadMore?: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await getNotificationsApi(
        userId,
        page,
        size,
        sort,
        direction
      );
      if (response.error || !response.data) {
        throw new Error(
          Array.isArray(response.error)
            ? response.error.join(", ")
            : response.error || "Failed to fetch notifications"
        );
      }
      // Đảm bảo dữ liệu serializable
      const serializedData = {
        ...response.data,
        content: response.data.content,
      };
      return { data: serializedData, isLoadMore };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch notifications");
    }
  }
);

// Async thunk để đánh dấu thông báo là đã đọc
export const markNotificationAsRead = createAsyncThunk(
  "notifications/markNotificationAsRead",
  async (
    { notificationId, userId }: { notificationId: number; userId: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await markNotificationAsReadApi(notificationId, userId);
      if (response.error || !response.data) {
        throw new Error(
          Array.isArray(response.error)
            ? response.error.join(", ")
            : response.error || "Failed to mark notification as read"
        );
      }
      // Đảm bảo dữ liệu serializable
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to mark notification as read"
      );
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    resetNotifications: (state) => {
      state.notifications = [];
      state.currentPage = 1;
      state.totalPages = 1;
      state.totalElements = 0;
      state.status = "idle";
      state.error = null;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.totalElements += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { data, isLoadMore } = action.payload;
        state.notifications = isLoadMore
          ? [...state.notifications, ...data.content]
          : data.content;
        state.currentPage = data.currentPage;
        state.totalPages = data.totalPages;
        state.totalElements = data.totalElements;
        state.error = null;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(markNotificationAsRead.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedNotification = action.payload;
        const index = state.notifications.findIndex(
          (n) => n.id === updatedNotification.id
        );
        if (index !== -1) {
          state.notifications[index] = updatedNotification;
        }
        state.error = null;
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { resetNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
