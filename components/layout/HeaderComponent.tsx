import React from "react";
import { View, TouchableOpacity, ViewStyle } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import RowComponent from "../common/RowComponent";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/global.styles";
import { useTheme } from "@/contexts/ThemeContext";

interface HeaderProps {
  centerContent?: React.ReactNode; // Phần tử ở giữa (logo, tiêu đề, hoặc bất kỳ component nào)
  showBack?: boolean; // Hiển thị nút quay lại
  actions?: React.ReactNode[]; // Các phần tử bên phải (icon, nút, v.v.)
  style?: ViewStyle | ViewStyle[]; // Style tùy chỉnh
}

const HeaderComponent: React.FC<HeaderProps> = ({
  centerContent,
  showBack = false,
  actions = [],
  style,
}) => {
  const { isDarkMode } = useTheme();
  const router = useRouter();

  return (
    <View
      style={[
        globalStyles.header,
        {
          backgroundColor: isDarkMode
            ? Colors.backgroundDark
            : Colors.backgroundLight,
          borderBottomColor: isDarkMode
            ? Colors.borderDark
            : Colors.borderLight,
        },
        style,
      ]}
    >
      <RowComponent
        alignItems="center"
        justifyContent="space-between"
        style={{ paddingVertical: 0, paddingHorizontal: 0 }}
      >
        {/* Nút quay lại */}
        {showBack ? (
          <TouchableOpacity
            onPress={() => router.back()}
            accessibilityLabel="Quay lại"
            accessibilityRole="button"
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color={
                isDarkMode ? Colors.textDarkPrimary : Colors.textLightPrimary
              }
            />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}

        {/* Phần tử ở giữa */}
        <View style={{ flex: 1, alignItems: "center" }}>
          {centerContent || <View />}
        </View>

        {/* Các phần tử bên phải */}
        <RowComponent alignItems="center">
          {actions.length > 0 ? (
            actions.map((action, index) => (
              <View key={`right-${index}`} style={{ marginLeft: 12 }}>
                {action}
              </View>
            ))
          ) : (
            <View style={{ width: 24 }} />
          )}
        </RowComponent>
      </RowComponent>
    </View>
  );
};

export default HeaderComponent;
