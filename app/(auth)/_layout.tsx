import ImageComponent from "@/components/common/ImageComponent";
import HeaderComponent from "@/components/layout/HeaderComponent";
import { Stack } from "expo-router";
import { Image } from "react-native";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitle: () => (
          <HeaderComponent
            centerContent={
              <ImageComponent
                source={require("@/assets/images/pizza-logo.png")}
                style={{ width: 120, height: 60 }}
                resizeMode="stretch"
              />
            }
          ></HeaderComponent>
        ),
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="reset-password" />
      <Stack.Screen name="verify-email" />
    </Stack>
  );
}
