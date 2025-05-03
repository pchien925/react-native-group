import React from "react";
import {
  TextStyle,
  ViewStyle,
  TouchableOpacity,
  StyleProp,
} from "react-native";
import TextComponent from "./TextComponent";
import ImageComponent from "./ImageComponent";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/global.styles";
import { useTheme } from "@/contexts/ThemeContext";

interface CardProps {
  title?: string;
  content?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  contentStyle?: StyleProp<TextStyle>;
  imageHeight?: number;
  onPress?: () => void;
  imageUrl?: string;
}

const CardComponent: React.FC<CardProps> = ({
  title,
  content,
  children,
  style,
  titleStyle,
  contentStyle,
  onPress,
  imageHeight,
  imageUrl,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <TouchableOpacity
      style={[
        globalStyles.card,
        {
          backgroundColor: isDarkMode
            ? Colors.surfaceDark
            : Colors.surfaceLight,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
      accessibilityLabel={title || "Card"}
      accessibilityRole="button"
    >
      {imageUrl && (
        <ImageComponent
          source={{ uri: imageUrl }}
          style={{
            width: "100%",
            height: imageHeight || 120,
            borderRadius: 8,
            marginBottom: 8,
          }}
        />
      )}
      {title && (
        <TextComponent
          type="subheading"
          style={[globalStyles.cardTitle, ...(titleStyle ? [titleStyle] : [])]}
        >
          {title}
        </TextComponent>
      )}
      {content && (
        <TextComponent
          type="body"
          style={[globalStyles.cardContent, contentStyle]}
        >
          {content}
        </TextComponent>
      )}
      {children}
    </TouchableOpacity>
  );
};

export default CardComponent;
