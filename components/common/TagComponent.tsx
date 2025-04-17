import React from "react";
import { View, Text, ViewStyle, TextStyle } from "react-native";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/globalStyles";
import { useTheme } from "@/contexts/ThemeContext";

type TagType = "success" | "warning" | "error" | "info" | "default";

interface TagProps {
  text: string;
  type?: TagType;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const TagComponent: React.FC<TagProps> = ({
  text,
  type = "default",
  style,
  textStyle,
}) => {
  const { isDarkMode } = useTheme();

  const getTagStyle = (): ViewStyle => {
    switch (type) {
      case "success":
        return { backgroundColor: Colors.success };
      case "warning":
        return { backgroundColor: Colors.warning };
      case "error":
        return { backgroundColor: Colors.error };
      case "info":
        return { backgroundColor: Colors.info };
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
        return { color: Colors.white };
      default:
        return {
          color: isDarkMode ? Colors.textDarkPrimary : Colors.textLightPrimary,
        };
    }
  };

  return (
    <View
      style={[globalStyles.tag, getTagStyle(), style]}
      accessibilityLabel={text}
    >
      <Text style={[globalStyles.tagText, getTextStyle(), textStyle]}>
        {text}
      </Text>
    </View>
  );
};

export default TagComponent;
