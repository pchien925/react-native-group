import React from "react";
import { View, ViewStyle } from "react-native";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/global.styles";
import { useTheme } from "@/contexts/ThemeContext";

interface ProgressProps {
  progress: number;
  style?: ViewStyle;
}

const ProgressComponent: React.FC<ProgressProps> = ({ progress, style }) => {
  const { isDarkMode } = useTheme();

  return (
    <View
      style={[
        globalStyles.progressContainer,
        {
          backgroundColor: isDarkMode ? Colors.borderDark : Colors.borderLight,
        },
        style,
      ]}
    >
      <View
        style={[
          globalStyles.progressBar,
          {
            width: `${Math.min(Math.max(progress, 0), 100)}%`,
            backgroundColor: isDarkMode ? Colors.primary : Colors.secondary,
          },
        ]}
      />
    </View>
  );
};

export default ProgressComponent;
