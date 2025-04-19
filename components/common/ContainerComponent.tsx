import React from "react";
import {
  View,
  ScrollView,
  ViewStyle,
  TextStyle,
  KeyboardAvoidingView,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/global.styles";
import { useTheme } from "@/contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

interface ContainerProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  padding?: number;
  scrollable?: boolean;
}

const ContainerComponent: React.FC<ContainerProps> = ({
  children,
  style,
  padding,
  scrollable = false,
}) => {
  const { isDarkMode } = useTheme();

  const containerStyle = [
    globalStyles.container,
    {
      backgroundColor: isDarkMode
        ? Colors.backgroundDark
        : Colors.backgroundLight,
    },
    padding ? { padding } : {},
    style,
  ];

  return scrollable ? (
    <SafeAreaView style={containerStyle}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  ) : (
    <SafeAreaView style={containerStyle}>{children}</SafeAreaView>
  );
};

export default ContainerComponent;
