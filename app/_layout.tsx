import { Stack } from "expo-router";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import Toast from "react-native-toast-message";
import CustomToast from "@/components/common/CustomToast";

const RootLayout = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SplashScreen" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="menu-item/[id]"
            options={{
              headerShown: true,
              headerTitle: "Chi tiết món ăn",
            }}
          />
          <Stack.Screen
            name="cart"
            options={{ headerShown: true, headerTitle: "Giỏ hàng" }}
          />
          <Stack.Screen
            name="checkout"
            options={{ headerShown: true, headerTitle: "Thanh toán" }}
          />
          <Stack.Screen
            name="order/[id]"
            options={{
              headerShown: true,
              headerTitle: "Chi tiết đơn hàng",
            }}
          />
          <Stack.Screen
            name="profile/detail"
            options={{
              headerShown: true,
              headerTitle: "Thông tin cá nhân",
            }}
          />
        </Stack>
        <Toast config={CustomToast} />
      </ThemeProvider>
    </Provider>
  );
};

export default RootLayout;
