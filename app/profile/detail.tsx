import React, { useEffect, useCallback } from "react";
import { ScrollView, StyleSheet } from "react-native";
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
import { getCurrentUser } from "@/store/slices/authSlice";
import CardComponent from "@/components/common/CardComponent";
import { View } from "react-native";

type IconName =
  | "mail-outline"
  | "call-outline"
  | "calendar-outline"
  | "person-outline"
  | "location-outline"
  | "star-outline"
  | "shield-checkmark-outline";

const ProfileDetailsScreen: React.FC = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useAppDispatch();
  const { user, status, error } = useAppSelector((state) => state.auth);

  // Fetch user data if not loaded
  useEffect(() => {
    if (!user && status === "idle") {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user, status]);

  // Handle navigation to edit profile (placeholder route)
  const handleEditProfile = useCallback(() => {
    console.log("Navigate to Edit Profile");
    // router.push("/profile/edit");
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
          title="Quay lại"
          type="primary"
          onPress={() => router.back()}
          style={styles.backButton}
          textStyle={styles.backButtonText}
        />
      </ContainerComponent>
    );
  }

  // Main profile details render
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
            </View>
          </RowComponent>
        </CardComponent>

        <SpaceComponent size={20} />

        {/* Detailed Information */}
        <CardComponent
          title="Thông tin cá nhân"
          style={[
            styles.infoCard,
            {
              backgroundColor: isDarkMode ? Colors.crust : Colors.garlicCream,
              borderColor: isDarkMode ? Colors.borderDark : Colors.mushroom,
            },
          ]}
          titleStyle={styles.sectionTitle}
        >
          {[
            {
              icon: "mail-outline" as IconName,
              label: "Email",
              value: user.email,
            },
            {
              icon: "call-outline" as IconName,
              label: "Số điện thoại",
              value: user.phone || "Chưa cung cấp",
            },
            {
              icon: "calendar-outline" as IconName,
              label: "Ngày sinh",
              value: user.dob || "Chưa cung cấp",
            },
            {
              icon: "person-outline" as IconName,
              label: "Giới tính",
              value:
                user.gender === "MALE"
                  ? "Nam"
                  : user.gender === "FEMALE"
                  ? "Nữ"
                  : user.gender || "Chưa cung cấp",
            },
            {
              icon: "location-outline" as IconName,
              label: "Địa chỉ",
              value: user.address || "Chưa cung cấp",
            },
            {
              icon: "star-outline" as IconName,
              label: "Điểm thưởng",
              value: user.loyaltyPointsBalance?.toString() || "0",
            },
            {
              icon: "shield-checkmark-outline" as IconName,
              label: "Trạng thái",
              value: user.status === "ACTIVE" ? "Hoạt động" : "Không hoạt động",
            },
          ].map((item, index) => (
            <RowComponent
              key={index}
              alignItems="center"
              style={[
                styles.infoRow,
                {
                  backgroundColor: isDarkMode
                    ? Colors.backgroundDark
                    : Colors.white,
                  shadowColor: Colors.black,
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 8,
                  elevation: 2,
                },
              ]}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={isDarkMode ? Colors.iconInactive : Colors.iconActive}
                style={styles.infoIcon}
              />
              <TextComponent
                style={[
                  styles.infoText,
                  {
                    color: isDarkMode
                      ? Colors.textDarkPrimary
                      : Colors.textLightPrimary,
                  },
                ]}
              >
                {item.label}:{" "}
                <TextComponent style={styles.infoValue}>
                  {item.value}
                </TextComponent>
              </TextComponent>
            </RowComponent>
          ))}
        </CardComponent>

        <SpaceComponent size={20} />

        {/* Action Buttons */}
        <RowComponent style={styles.buttonRow}>
          <ButtonComponent
            title="Chỉnh sửa hồ sơ"
            type="outline"
            onPress={handleEditProfile}
            style={[
              styles.editButton,
              {
                borderColor: isDarkMode ? Colors.primary : Colors.accent,
              },
            ]}
            textStyle={[
              styles.editButtonText,
              {
                color: isDarkMode ? Colors.primary : Colors.accent,
              },
            ]}
          />
          <ButtonComponent
            title="Quay lại"
            type="primary"
            onPress={() => router.back()}
            style={[
              styles.backButton,
              {
                backgroundColor: isDarkMode ? Colors.primary : Colors.accent,
              },
            ]}
            textStyle={styles.backButtonText}
          />
        </RowComponent>

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
  infoCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",

    color: Colors.textDarkPrimary,
  },
  infoRow: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 15,
    flex: 1,
  },
  infoValue: {
    fontWeight: "600",
  },
  buttonRow: {
    justifyContent: "space-between",
  },
  editButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    marginRight: 8,
    borderWidth: 2,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    marginLeft: 8,
    elevation: 2,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.white,
  },
});

export default ProfileDetailsScreen;
