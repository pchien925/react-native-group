// TabsLayout.tsx
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ImageComponent from "@/components/common/ImageComponent";
import BadgeComponent from "@/components/common/BadgeComponent";
import HeaderComponent from "@/components/layout/HeaderComponent";
import { Tabs } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { router } from "expo-router";

export default function TabsLayout() {
  const cartCount = useSelector(
    (state: RootState) => state.cart.cart?.cartItems.length || 0
  );
  const unreadCount = useSelector(
    (state: RootState) =>
      state.notifications.notifications.filter((n) => !n.isRead).length || 0
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTitle: () => (
          <HeaderComponent
            showBack
            centerContent={
              <ImageComponent
                source={require("@/assets/images/pizza-logo.png")}
                style={{ width: 120, height: 60, marginLeft: 20 }}
                resizeMode="stretch"
              />
            }
            actions={[
              <TouchableOpacity
                key="cart"
                style={styles.cartContainer}
                onPress={() => router.push("/cart")}
                accessibilityLabel="Giỏ hàng"
                accessibilityRole="button"
              >
                <Ionicons
                  name="cart-outline"
                  size={26}
                  color={Colors.textLightPrimary}
                />
                {cartCount > 0 && (
                  <BadgeComponent
                    text={cartCount > 99 ? "99+" : cartCount.toString()}
                    type="error"
                    style={styles.badge}
                    textStyle={styles.badgeText}
                  />
                )}
              </TouchableOpacity>,
            ]}
          />
        ),
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLightSecondary,
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={focused ? 28 : 24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: "Thực đơn",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "restaurant" : "restaurant-outline"}
              size={focused ? 28 : 24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Yêu thích",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "heart" : "heart-outline"}
              size={focused ? 28 : 24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: "Thông báo",
          tabBarIcon: ({ focused, color }) => (
            <View style={styles.tabIconContainer}>
              <Ionicons
                name={focused ? "notifications" : "notifications-outline"}
                size={focused ? 28 : 24}
                color={color}
              />
              {unreadCount > 0 && (
                <BadgeComponent
                  text={unreadCount > 99 ? "99+" : unreadCount.toString()}
                  type="error"
                  style={styles.tabBadge}
                  textStyle={styles.badgeText}
                />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Hồ sơ",
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={focused ? 28 : 24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  cartContainer: {
    position: "relative",
    padding: 8,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingVertical: 0,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  tabBadge: {
    position: "absolute",
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingVertical: 0,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  tabBar: {
    backgroundColor: Colors.backgroundLight,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: "500",
    marginBottom: 4,
  },
  tabIconContainer: {
    position: "relative",
  },
});
