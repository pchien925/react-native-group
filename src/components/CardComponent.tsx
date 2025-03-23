import {
  View,
  Text,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
import React, { ReactNode } from "react";
import { globalStyles } from "../styles/globalStyles";
import { appColors } from "../constants/appColors";

interface IProps {
  children: ReactNode;
  bgColor?: string;
  styles?: StyleProp<ViewStyle>;
  onPress?: () => void; // Thêm prop onPress
}

const CardComponent = (props: IProps) => {
  const { children, bgColor, styles, onPress } = props;

  return (
    <TouchableOpacity
      style={[
        globalStyles.shadow,
        globalStyles.card,
        {
          backgroundColor: bgColor ?? appColors.white,
        },
        styles,
      ]}
      onPress={onPress} // Truyền onPress vào TouchableOpacity
    >
      {children}
    </TouchableOpacity>
  );
};

export default CardComponent;
