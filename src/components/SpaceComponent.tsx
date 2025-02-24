import { View, Text } from "react-native";
import React from "react";

interface IProps {
  width?: number;
  height?: number;
}

const SpaceComponent = (props: IProps) => {
  const { width, height } = props;

  return <View style={{ width, height }}></View>;
};

export default SpaceComponent;
