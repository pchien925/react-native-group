import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { globalStyles } from "@/styles/global.styles";

interface SpaceProps {
  size?: number;
  horizontal?: boolean;
  style?: StyleProp<ViewStyle>;
}

const SpaceComponent: React.FC<SpaceProps> = ({
  size = 8,
  horizontal = false,
  style,
}) => {
  return (
    <View
      style={[
        globalStyles.space,
        {
          height: horizontal ? undefined : size,
          width: horizontal ? size : undefined,
        },
        style,
      ]}
    />
  );
};

export default SpaceComponent;
