import React from "react";
import { View, Text, ViewStyle, TextStyle } from "react-native";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/global.styles";
import { useTheme } from "@/contexts/ThemeContext";

interface SectionProps {
  title?: string;
  children: React.ReactNode;
  style?: ViewStyle;
  titleStyle?: TextStyle;
}

const SectionComponent: React.FC<SectionProps> = ({
  title,
  children,
  style,
  titleStyle,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <View style={[globalStyles.section, style]}>
      {title && (
        <Text
          style={[
            globalStyles.sectionTitle,
            {
              color: isDarkMode
                ? Colors.textDarkPrimary
                : Colors.textLightPrimary,
            },
            titleStyle,
          ]}
        >
          {title}
        </Text>
      )}
      {children}
    </View>
  );
};

export default SectionComponent;
