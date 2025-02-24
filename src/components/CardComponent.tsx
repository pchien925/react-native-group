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
}

const CardComponent = (props: IProps) => {
  const { children, bgColor, styles } = props;
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
    >
      {children}
    </TouchableOpacity>
  );
};

export default CardComponent;
