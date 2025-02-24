import { View, Text, StyleProp, TextStyle, Platform } from "react-native";
import React from "react";
import { globalStyles } from "../styles/globalStyles";
import { appColors } from "../constants/appColors";
import { fontFamilies } from "../constants/fontFamilies";

interface IProps {
  text: string;
  color?: string;
  size?: number;
  flex?: number;
  font?: string;
  title?: boolean;
  numberOfLines?: number;
  styles?: StyleProp<TextStyle>;
}

const TextComponent = (props: IProps) => {
  const { text, color, size, flex, font, title, numberOfLines, styles } = props;
  const fontSizeDefault = Platform.OS === "ios" ? 16 : 14;
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        globalStyles.text,
        {
          color: color ?? appColors.text,
          flex: flex ?? 0,
          fontSize: size ? size : title ? 24 : fontSizeDefault,
          fontFamily: font
            ? font
            : title
            ? fontFamilies.medium
            : fontFamilies.regular,
        },
        styles,
      ]}
    >
      {text}
    </Text>
  );
};

export default TextComponent;
