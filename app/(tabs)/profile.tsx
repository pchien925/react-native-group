import React, { useEffect, useCallback, useState } from "react";
import { ScrollView, StyleSheet, Alert, View } from "react-native";
import { router } from "expo-router";
import ContainerComponent from "@/components/common/ContainerComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import TextComponent from "@/components/common/TextComponent";
import ButtonComponent from "@/components/common/ButtonComponent";
import RowComponent from "@/components/common/RowComponent";
import LoadingComponent from "@/components/common/LoadingComponent";
import ImageComponent from "@/components/common/ImageComponent";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { getCurrentUser, logout } from "@/store/slices/authSlice";
import Toast from "react-native-toast-message";
import CardComponent from "@/components/common/CardComponent";

const ProfileScreen: React.FC = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector((state) => state.auth);

  // Fetch user data if not loaded
  useEffect(() => {
    if (!user && status === "idle") {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user, status]);

  // Handle logout with confirmation
  const handleLogout = useCallback(() => {
    Alert.alert(
      "Xác nhận đăng xuất",
      "Bạn có chắc muốn đăng xuất?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đăng xuất",
          onPress: async () => {
            try {
              await dispatch(logout()).unwrap();
              Toast.show({
                type: "success",
                text1: "Đăng xuất thành công!",
                visibilityTime: 3000,
              });
              router.replace("/login");
            } catch (err: any) {
              Toast.show({
                type: "error",
                text1: err.message || "Không thể đăng xuất",
                visibilityTime: 3000,
              });
            }
          },
        },
      ],
      { cancelable: true }
    );
  }, [dispatch]);

  // Handle navigation to profile details (placeholder route)
  // In ProfileScreen.tsx
  const handleViewProfileDetails = useCallback(() => {
    router.push("/profile/detail");
  }, []);

  // Handle navigation to notifications (placeholder route)
  const handleViewOrder = useCallback(() => {
    router.push("/order/history");
  }, []);

  // Render loading state
  if (status === "loading") {
    return (
      <ContainerComponent style={styles.container}>
        <LoadingComponent
          loadingText="Đang tải thông tin..."
          style={styles.loadingContainer}
        />
      </ContainerComponent>
    );
  }

  // Render error or no-user state
  if (status === "failed" || !user) {
    return (
      <ContainerComponent style={styles.container}>
        <CardComponent
          title="Lỗi"
          content={error || "Không thể tải thông tin người dùng"}
          style={[
            styles.errorCard,
            {
              backgroundColor: isDarkMode ? Colors.crust : Colors.garlicCream,
              borderColor: isDarkMode ? Colors.borderDark : Colors.error,
            },
          ]}
          titleStyle={{
            color: isDarkMode
              ? Colors.textDarkPrimary
              : Colors.textLightPrimary,
            fontWeight: "700",
          }}
        />
        <ButtonComponent
          title="Đăng xuất"
          type="primary"
          onPress={handleLogout}
          style={styles.logoutButton}
          textStyle={styles.logoutButtonText}
        />
      </ContainerComponent>
    );
  }

  // Main profile render
  return (
    <ContainerComponent
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode
            ? Colors.backgroundDark
            : Colors.backgroundLight,
        },
      ]}
      scrollable
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <CardComponent
          style={[
            styles.headerCard,
            {
              backgroundColor: isDarkMode ? Colors.crust : Colors.basil,
              borderColor: isDarkMode ? Colors.borderDark : Colors.olive,
            },
          ]}
        >
          <RowComponent alignItems="center" style={styles.headerRow}>
            {user.avatar ? (
              <ImageComponent
                source={{ uri: user.avatar }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons
                  name="person-circle-outline"
                  size={64}
                  color={isDarkMode ? Colors.iconInactive : Colors.iconActive}
                />
              </View>
            )}
            <View style={styles.headerTextContainer}>
              <TextComponent
                style={[
                  styles.userName,
                  { color: isDarkMode ? Colors.textDarkPrimary : Colors.white },
                ]}
              >
                {user.fullName}
              </TextComponent>
              <TextComponent
                style={[
                  styles.userEmail,
                  {
                    color: isDarkMode ? Colors.textDarkSecondary : Colors.white,
                  },
                ]}
              >
                {user.email}
              </TextComponent>
              {user.phone && (
                <TextComponent
                  style={[
                    styles.userPhone,
                    {
                      color: isDarkMode
                        ? Colors.textDarkSecondary
                        : Colors.white,
                    },
                  ]}
                >
                  {user.phone}
                </TextComponent>
              )}
            </View>
          </RowComponent>
        </CardComponent>

        <SpaceComponent size={20} />

        <CardComponent
          title="Tùy chọn"
          style={[
            styles.infoCard,
            {
              backgroundColor: isDarkMode
                ? Colors.backgroundDark
                : Colors.backgroundLight,
              borderColor: isDarkMode ? Colors.borderDark : Colors.mushroom,
            },
          ]}
          titleStyle={styles.sectionTitle}
        >
          <RowComponent
            alignItems="center"
            style={[
              styles.actionRow,
              {
                backgroundColor: isDarkMode
                  ? Colors.backgroundDark
                  : Colors.white,
                shadowColor: Colors.black,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 3,
              },
            ]}
            onPress={handleViewProfileDetails}
          >
            <Ionicons
              name="person-outline"
              size={24}
              color={isDarkMode ? Colors.iconInactive : Colors.iconActive}
              style={styles.actionIcon}
            />
            <TextComponent
              style={[
                styles.actionText,
                {
                  color: isDarkMode
                    ? Colors.textDarkPrimary
                    : Colors.textLightPrimary,
                },
              ]}
            >
              Xem chi tiết trang cá nhân
            </TextComponent>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDarkMode ? Colors.iconInactive : Colors.iconActive}
              style={styles.arrowIcon}
            />
          </RowComponent>
          <RowComponent
            alignItems="center"
            style={[
              styles.actionRow,
              {
                backgroundColor: isDarkMode
                  ? Colors.backgroundDark
                  : Colors.white,
                shadowColor: Colors.black,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 3,
              },
            ]}
            onPress={handleViewOrder}
          >
            <Ionicons
              name="receipt-outline"
              size={24}
              color={isDarkMode ? Colors.iconInactive : Colors.iconActive}
              style={styles.actionIcon}
            />
            <TextComponent
              style={[
                styles.actionText,
                {
                  color: isDarkMode
                    ? Colors.textDarkPrimary
                    : Colors.textLightPrimary,
                },
              ]}
            >
              Đơn hàng của bạn
            </TextComponent>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDarkMode ? Colors.iconInactive : Colors.iconActive}
              style={styles.arrowIcon}
            />
          </RowComponent>
          <RowComponent
            alignItems="center"
            style={[
              styles.actionRow,
              {
                backgroundColor: isDarkMode
                  ? Colors.backgroundDark
                  : Colors.white,
                shadowColor: Colors.black,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 3,
              },
            ]}
            onPress={handleLogout}
          >
            <Ionicons
              name="log-out-outline"
              size={24}
              color={isDarkMode ? Colors.iconInactive : Colors.iconActive}
              style={styles.actionIcon}
            />
            <TextComponent
              style={[
                styles.actionText,
                {
                  color: isDarkMode
                    ? Colors.textDarkPrimary
                    : Colors.textLightPrimary,
                },
              ]}
            >
              Đăng xuất
            </TextComponent>
          </RowComponent>
        </CardComponent>

        <SpaceComponent size={30} />
      </ScrollView>
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
  errorCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 3,
  },
  headerCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: {
    marginTop: 8,
  },
  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundLight,
    marginRight: 16,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  headerTextContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.8,
    marginTop: 4,
  },
  userPhone: {
    fontSize: 14,
    opacity: 0.8,
    marginTop: 4,
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 24,
    padding: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.9,
    shadowRadius: 9,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: Colors.textDarkPrimary,
  },
  actionRow: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginVertical: 12,
    borderRadius: 8,
    borderWidth: 0.2,
  },
  actionIcon: {
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    flex: 1,
  },
  arrowIcon: {
    marginLeft: 8,
  },
  logoutButton: {
    borderRadius: 12,
    paddingVertical: 12,
    marginVertical: 8,
    elevation: 2,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.white,
  },
});

export default ProfileScreen;
