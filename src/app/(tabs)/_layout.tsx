import { Tabs } from "expo-router";
import HeaderComponent from "@/src/components/HeaderComponent";
import { Ionicons } from "@expo/vector-icons"; // Sử dụng thư viện icon (cần cài đặt)

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        header: () => <HeaderComponent />,
        tabBarActiveTintColor: "#007AFF", // Màu khi tab được chọn
        tabBarInactiveTintColor: "#8E8E93", // Màu khi tab không được chọn
        tabBarStyle: {
          backgroundColor: "#FFFFFF", // Màu nền của tab bar
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"} // Icon thay đổi khi active
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
