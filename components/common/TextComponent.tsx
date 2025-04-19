import React from "react";
import {
  Text as RNText,
  TextStyle,
  TextProps as RNTextProps,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/global.styles";
import { useTheme } from "@/contexts/ThemeContext";

type TextType = "heading" | "subheading" | "body" | "caption";

interface TextProps extends RNTextProps {
  children: React.ReactNode;
  type?: TextType;
  style?: TextStyle | TextStyle[];
  accessible?: boolean;
  accessibilityLabel?: string;
}

const TextComponent: React.FC<TextProps> = ({
  children,
  type = "body",
  style,
  accessible = true,
  accessibilityLabel,
  ...rest
}) => {
  const { isDarkMode } = useTheme();

  const getBaseStyle = (): TextStyle => {
    switch (type) {
      case "heading":
        return globalStyles.textHeading;
      case "subheading":
        return globalStyles.textSubheading;
      case "caption":
        return globalStyles.textCaption;
      default:
        return globalStyles.textBody;
    }
  };

  const normalizedStyle = Array.isArray(style)
    ? style.filter((s): s is TextStyle => s !== undefined && s !== null)
    : style;

  return (
    <RNText
      style={[
        getBaseStyle(),
        {
          color: isDarkMode ? Colors.textDarkPrimary : Colors.textLightPrimary,
        },
        normalizedStyle,
      ]}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel}
      {...rest}
    >
      {children}
    </RNText>
  );
};

export default TextComponent;
