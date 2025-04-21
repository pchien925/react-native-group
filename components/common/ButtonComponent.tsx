import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/global.styles";
import { useTheme } from "@/contexts/ThemeContext";

// Định nghĩa các kiểu nút
type ButtonType = "primary" | "secondary" | "outline" | "text";

// Định nghĩa interface cho props
interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: ButtonType;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
}

// Component nút với các kiểu và trạng thái
const ButtonComponent: React.FC<ButtonProps> = ({
  title,
  onPress,
  type = "primary",
  disabled = false,
  loading = false,
  style,
  textStyle,
  accessibilityLabel,
}) => {
  const { isDarkMode } = useTheme();

  // Lấy kiểu dáng cho nút
  const getButtonStyle = (): ViewStyle => {
    switch (type) {
      case "primary":
        return {
          backgroundColor: disabled ? Colors.disabled : Colors.primary,
          borderWidth: 0,
        };
      case "secondary":
        return {
          backgroundColor: disabled
            ? Colors.textLightSecondary
            : Colors.secondary,
          borderWidth: 0,
        };
      case "outline":
        return {
          backgroundColor: Colors.transparent,
          borderWidth: 1,
          borderColor: isDarkMode ? Colors.borderDark : Colors.borderLight,
        };
      case "text":
        return {
          backgroundColor: Colors.transparent,
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: Colors.primary,
          borderWidth: 0,
        };
    }
  };

  // Lấy kiểu dáng cho văn bản
  const getTextStyle = (): TextStyle => {
    switch (type) {
      case "primary":
      case "secondary":
        return {
          color: disabled
            ? Colors.textLightSecondary
            : isDarkMode
            ? Colors.textDarkPrimary
            : Colors.white,
        };
      case "outline":
        return {
          color: disabled
            ? Colors.textLightSecondary
            : isDarkMode
            ? Colors.textDarkPrimary
            : Colors.textLightPrimary,
        };
      case "text":
        return {
          color: disabled
            ? Colors.textLightSecondary
            : isDarkMode
            ? Colors.textDarkPrimary
            : Colors.primary,
        };
      default:
        return {
          color: isDarkMode ? Colors.textDarkPrimary : Colors.white,
        };
    }
  };

  return (
    <TouchableOpacity
      style={[globalStyles.button, getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator
          color={
            type === "outline" || type === "text"
              ? isDarkMode
                ? Colors.textDarkPrimary
                : Colors.primary
              : Colors.white
          }
          size="small"
        />
      ) : (
        <Text style={[globalStyles.buttonText, getTextStyle(), textStyle]}>
          {title || "Nút"}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default ButtonComponent;
