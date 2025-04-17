import React from "react";
import { View, ViewStyle } from "react-native";
import { globalStyles } from "@/styles/globalStyles";

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
}

const RowComponent: React.FC<RowProps> = ({
  children,
  style,
  justifyContent = "space-between",
  alignItems = "center",
}) => {
  return (
    <View
      style={[
        globalStyles.row,
        {
          justifyContent,
          alignItems,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default RowComponent;
