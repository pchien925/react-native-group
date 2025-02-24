import { View, StyleProp, ViewStyle, TouchableOpacity } from "react-native";
import React from "react";
import { globalStyles } from "../styles/globalStyles";

interface IProps {
  justifyContent?:
    | "center"
    | "flex-start"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly"
    | undefined;
  styles?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  onPress?: () => void;
}

const RowComponent = (props: IProps) => {
  const { justifyContent, styles, children, onPress } = props;
  const localStyles = [
    globalStyles.row,
    {
      justifyContent: justifyContent ?? "center",
    },
    styles,
  ];

  return onPress ? (
    <TouchableOpacity activeOpacity={0.5} onPress={onPress} style={localStyles}>
      {children}
    </TouchableOpacity>
  ) : (
    <View style={localStyles}>{children}</View>
  );
};

export default RowComponent;
