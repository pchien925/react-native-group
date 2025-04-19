import { Stack } from "expo-router";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import { Provider } from "react-redux";
import { store } from "@/store/store";

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
            name="Cart"
            options={{ headerShown: true, headerTitle: "Giỏ hàng" }}
          />
        </Stack>
      </ThemeProvider>
    </Provider>
  );
};

export default RootLayout;
