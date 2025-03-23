import React from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const RootLayout = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: "Login" }} />
        <Stack.Screen name="register" options={{ title: "Register" }} />
        <Stack.Screen name="verify" options={{ title: "Verify" }} />
        <Stack.Screen
          name="forgotPassword"
          options={{ title: "Forgot Password" }}
        />
        <Stack.Screen
          name="resetPassword"
          options={{ title: "Reset Password" }}
        />
        <Stack.Screen
          name="changePassword"
          options={{ title: "Change Password" }}
        />
      </Stack>
    </SafeAreaView>
  );
};

export default RootLayout;
