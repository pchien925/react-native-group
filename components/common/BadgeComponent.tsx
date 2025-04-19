import React from "react";
import { View, ViewStyle, TextStyle } from "react-native";
import TextComponent from "./TextComponent";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/global.styles";
import { useTheme } from "@/contexts/ThemeContext";

type BadgeType =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "default"
  | "primary";

interface BadgeProps {
  text: string;
  type?: BadgeType;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const BadgeComponent: React.FC<BadgeProps> = ({
  text,
  type = "default",
  style,
  textStyle,
}) => {
  const { isDarkMode } = useTheme();

  const getBadgeStyle = (): ViewStyle => {
    switch (type) {
      case "success":
        return { backgroundColor: Colors.success };
      case "warning":
        return { backgroundColor: Colors.warning };
      case "error":
        return { backgroundColor: Colors.error };
      case "info":
        return { backgroundColor: Colors.info };
      case "primary":
        return { backgroundColor: Colors.primary };
      default:
        return {
          backgroundColor: isDarkMode ? Colors.borderDark : Colors.borderLight,
        };
    }
  };

  const getTextStyle = (): TextStyle => {
    switch (type) {
      case "success":
      case "warning":
      case "error":
      case "info":
      case "primary":
        return { color: Colors.white };
      default:
        return {};
    }
  };

  return (
    <View style={[globalStyles.badge, getBadgeStyle(), style]}>
      <TextComponent
        type="caption"
        style={[
          globalStyles.badgeText,
          getTextStyle(),
          ...(textStyle ? [textStyle] : []),
        ]}
      >
        {text}
      </TextComponent>
    </View>
  );
};

export default BadgeComponent;
