import { View, Text } from "react-native";
import React from "react";
import RowComponent from "./RowComponent";
import TextComponent from "./TextComponent";
import { appColors } from "../constants/appColors";
import AntDesign from "@expo/vector-icons/AntDesign";

interface IProps {
  title: string;
  onPress: () => void;
}

const TagBarComponent = (props: IProps) => {
  const { title, onPress } = props;
  return (
    <RowComponent
      onPress={onPress}
      styles={{ marginBottom: 12, paddingHorizontal: 16 }}
    >
      <TextComponent numberOfLines={1} size={18} title text={title} flex={1} />
      <RowComponent>
        <TextComponent text="See All" color={appColors.gray} />
        <AntDesign name="arrowright" size={14} color={appColors.gray} />
      </RowComponent>
    </RowComponent>
  );
};

export default TagBarComponent;
