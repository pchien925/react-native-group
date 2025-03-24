// app/_sitemap.tsx
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useRouter, Link } from "expo-router";

// Định nghĩa kiểu cho các tuyến đường hợp lệ
type AppRoute =
  | "/(tabs)"
  | "/auth/Login"
  | "/auth/Register"
  | "/auth/OtpVerification"
  | "/auth/ForgotPassword"
  | "/auth/ResetPassword"
  | "/auth/ResetSuccessfully"
  | "/user/Profile"
  | "/OnBoarding"
  | "/Splash"
  | "/"
  | "/_sitemap"
  | "/+not-found";

const Sitemap = () => {
  const router = useRouter();

  // Danh sách các tuyến đường (routes) trong ứng dụng
  const routes: { name: string; path: AppRoute }[] = [
    { name: "(tabs)", path: "/(tabs)" },
    { name: "Login", path: "/auth/Login" },
    { name: "Register", path: "/auth/Register" },
    { name: "OtpVerification", path: "/auth/OtpVerification" },
    { name: "ForgotPassword", path: "/auth/ForgotPassword" },
    { name: "ResetPassword", path: "/auth/ResetPassword" },
    { name: "ResetSuccessfully", path: "/auth/ResetSuccessfully" },
    { name: "Profile", path: "/user/Profile" },
    { name: "OnBoarding", path: "/OnBoarding" },
    { name: "Splash", path: "/Splash" },
    { name: "Home", path: "/" }, // index route
  ];

  const renderItem = ({ item }: { item: { name: string; path: AppRoute } }) => (
    <Text style={styles.route} onPress={() => router.push(item.path)}>
      {item.name} ({item.path})
    </Text>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sitemap</Text>
      <FlatList
        data={routes}
        renderItem={renderItem}
        keyExtractor={(item) => item.path}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  route: {
    fontSize: 16,
    paddingVertical: 8,
    color: "#007AFF",
  },
});

export default Sitemap;
