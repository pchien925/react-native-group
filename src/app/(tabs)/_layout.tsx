import { Tabs } from "expo-router";
import HeaderComponent from "@/src/components/HeaderComponent";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

export default function TabLayout() {
  // Định nghĩa các màu sắc và kích thước chung
  const colors = {
    active: "#FF0000",
    inactive: "#8E8E93",
    background: "#FFFFFF",
  };

  const sizes = {
    defaultIcon: 24,
    centerIcon: 50,
  };

  return (
    <Tabs
      screenOptions={{
        header: () => <HeaderComponent />,
        tabBarActiveTintColor: colors.active,
        tabBarInactiveTintColor: colors.inactive,
        tabBarStyle: {
          backgroundColor: colors.background,
          height: 56,
          borderTopWidth: 1,
          borderTopColor: "#E5E5EA",
        },
      }}
    >
      {/* Tab 1: Home */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="home-outline" // Giữ nguyên outline
              size={sizes.defaultIcon}
              color={color}
            />
          ),
        }}
      />

      {/* Tab 2: Order */}
      <Tabs.Screen
        name="order"
        options={{
          title: "Đơn hàng",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="receipt-outline" // Giữ nguyên outline
              size={sizes.defaultIcon}
              color={color}
            />
          ),
        }}
      />

      {/* Tab 3: Menu (Center Button) */}
      <Tabs.Screen
        name="menu"
        options={{
          title: "Thực đơn",
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                position: "absolute",
                top: -20,
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: colors.background,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
              }}
            >
              <Ionicons
                name="pizza-outline" // Giữ nguyên outline
                size={sizes.centerIcon}
                color={focused ? colors.active : colors.inactive}
              />
            </View>
          ),
          tabBarLabel: "",
        }}
      />

      {/* Tab 4: Chat */}
      <Tabs.Screen
        name="chat"
        options={{
          title: "Nhắn tin",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="chatbubble-outline" // Giữ nguyên outline
              size={sizes.defaultIcon}
              color={color}
            />
          ),
        }}
      />

      {/* Tab 5: Profile */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="person-outline" // Giữ nguyên outline
              size={sizes.defaultIcon}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
