import { View, Text, StyleProp, ViewStyle } from "react-native";
import React from "react";
import { globalStyles } from "../styles/globalStyles";

interface IProps {
  children?: React.ReactNode;
  styles?: StyleProp<ViewStyle>;
}

const SectionComponent = (props: IProps) => {
  const { children, styles } = props;

  return <View style={[globalStyles.section, styles]}>{children}</View>;
};

export default SectionComponent;
