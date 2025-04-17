import React from "react";
import { View, Text, Image, ViewStyle, ImageStyle } from "react-native";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/globalStyles";
import { useTheme } from "@/contexts/ThemeContext";

interface AvatarProps {
  imageUrl?: string;
  name?: string;
  size?: number;
  style?: ViewStyle | ViewStyle[];
  imageStyle?: ImageStyle;
}

const AvatarComponent: React.FC<AvatarProps> = ({
  imageUrl,
  name,
  size = 40,
  style,
  imageStyle,
}) => {
  const { isDarkMode } = useTheme();

  const getInitials = (name?: string) => {
    if (!name || typeof name !== "string") return "?";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View
      style={[
        globalStyles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isDarkMode ? Colors.borderDark : Colors.primary,
        },
        style,
      ]}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={[{ width: size, height: size }, imageStyle]}
        />
      ) : (
        <Text style={[globalStyles.avatarText]}>
          {name ? getInitials(name) : "?"}
        </Text>
      )}
    </View>
  );
};

export default AvatarComponent;
