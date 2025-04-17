import { Stack } from "expo-router";
import { ThemeProvider } from "@/contexts/ThemeContext";

const RootLayout = () => {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
};

export default RootLayout;
