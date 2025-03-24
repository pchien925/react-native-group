import React from "react";
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { AlertNotificationRoot } from "react-native-alert-notification";

const RootLayout = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AlertNotificationRoot>
        <Stack screenOptions={{ headerShown: false }}>
          {/* Existing Routes */}
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth/Login" options={{ title: "Login" }} />
          <Stack.Screen name="auth/Register" options={{ title: "Register" }} />
          <Stack.Screen
            name="auth/OtpVerification"
            options={{ title: "Verify" }}
          />
          <Stack.Screen
            name="auth/ForgotPassword"
            options={{ title: "Forgot Password" }}
          />
          <Stack.Screen
            name="auth/ResetPassword"
            options={{ title: "Reset Password" }}
          />
          <Stack.Screen name="OnBoarding" options={{ title: "Onboarding" }} />
          <Stack.Screen name="Splash" options={{ title: "Splash" }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />{" "}
          <Stack.Screen name="+not-found" options={{ title: "Not Found" }} />
          <Stack.Screen name="_sitemap" options={{ title: "Sitemap" }} />
          <Stack.Screen
            name="auth/ResetSuccessfully"
            options={{ title: "Reset Successfully" }}
          />
          <Stack.Screen name="user/Profile" options={{ title: "Profile" }} />
        </Stack>
      </AlertNotificationRoot>
    </SafeAreaView>
  );
};

export default RootLayout;
