import React, { useEffect } from "react";
import { View, Text, ViewStyle, TextStyle, Animated } from "react-native";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/global.styles";
import { useTheme } from "@/contexts/ThemeContext";

type ToastType = "success" | "warning" | "error" | "info" | "default";

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onHide: () => void;
  duration?: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const ToastComponent: React.FC<ToastProps> = ({
  message,
  type = "default",
  visible,
  onHide,
  duration = 3000,
  style,
  textStyle,
}) => {
  const { isDarkMode } = useTheme();
  const opacity = new Animated.Value(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onHide());
      }, duration);
    }
    return () => {
      clearTimeout(timer);
      opacity.stopAnimation();
    };
  }, [visible, duration, onHide]);

  const getToastStyle = (): ViewStyle => {
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
          backgroundColor: isDarkMode
            ? Colors.surfaceDark
            : Colors.surfaceLight,
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

  if (!visible) return null;

  return (
    <Animated.View
      style={[globalStyles.toast, getToastStyle(), { opacity }, style]}
      accessibilityLabel={message}
      accessibilityRole="alert"
    >
      <Text style={[globalStyles.toastText, getTextStyle(), textStyle]}>
        {message}
      </Text>
    </Animated.View>
  );
};

export default ToastComponent;
