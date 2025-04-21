import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/global.styles";
import { useTheme } from "@/contexts/ThemeContext";

interface LoadingProps {
  loadingText?: string;
  size?: "small" | "large";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  accessibilityLabel?: string;
}

const LoadingComponent: React.FC<LoadingProps> = ({
  loadingText,
  size = "large",
  style,
  textStyle,
  accessibilityLabel = "Đang tải",
}) => {
  const { isDarkMode } = useTheme();

  return (
    <View
      style={[
        globalStyles.container,
        {
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: isDarkMode
            ? Colors.backgroundDark
            : Colors.backgroundLight,
        },
        style,
      ]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="alert"
    >
      <ActivityIndicator
        size={size}
        color={isDarkMode ? Colors.textDarkPrimary : Colors.primary}
      />
      {loadingText && (
        <Text
          style={[
            globalStyles.textBody,
            {
              color: isDarkMode
                ? Colors.textDarkPrimary
                : Colors.textLightPrimary,
              marginTop: 8,
            },
            textStyle,
          ]}
        >
          {loadingText}
        </Text>
      )}
    </View>
  );
};

export default LoadingComponent;
