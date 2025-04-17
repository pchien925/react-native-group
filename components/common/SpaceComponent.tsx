import React from "react";
import { View, ViewStyle } from "react-native";
import { globalStyles } from "@/styles/globalStyles";

interface SpaceProps {
  size?: number;
  horizontal?: boolean;
  style?: ViewStyle;
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
