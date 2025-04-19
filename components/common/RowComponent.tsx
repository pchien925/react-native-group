import React from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import { globalStyles } from "@/styles/global.styles";

interface RowProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  alignItems?: "flex-start" | "flex-end" | "center" | "stretch" | "baseline";
  onPress?: () => void;
}

const RowComponent: React.FC<RowProps> = ({
  children,
  style,
  justifyContent,
  alignItems,
  onPress,
}) => {
  const rowStyle = [
    globalStyles.row,
    {
      justifyContent,
      alignItems,
    },
    style,
  ];

  return onPress ? (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress} style={rowStyle}>
      {children}
    </TouchableOpacity>
  ) : (
    <View style={rowStyle}>{children}</View>
  );
};

export default RowComponent;
