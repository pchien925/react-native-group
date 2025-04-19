// src/components/home/MenuItemComponent.tsx
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import ImageComponent from "@/components/common/ImageComponent";
import TextComponent from "@/components/common/TextComponent";
import ButtonComponent from "@/components/common/ButtonComponent";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/global.styles";

interface IMenuItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  basePrice: number;
}

interface menuItemItemProps {
  menuItem: IMenuItem;
  onPress?: (menuItem: IMenuItem) => void;
  onAddToCart?: (menuItem: IMenuItem) => void;
}

const MenuItemComponent: React.FC<menuItemItemProps> = ({
  menuItem,
  onPress,
  onAddToCart,
}) => {
  return (
    <TouchableOpacity
      style={globalStyles.menuItemItem}
      onPress={() => onPress?.(menuItem)}
      accessibilityLabel={menuItem.name}
    >
      <ImageComponent
        source={{ uri: menuItem.imageUrl }}
        style={globalStyles.menuItemImage}
        resizeMode="cover"
      />
      <TextComponent style={globalStyles.menuItemName}>
        {menuItem.name}
      </TextComponent>
      <TextComponent style={globalStyles.menuItemPrice}>
        {menuItem.basePrice.toLocaleString("vi-VN")} VNĐ
      </TextComponent>
      <TextComponent style={globalStyles.menuItemDescription} numberOfLines={2}>
        {menuItem.description}
      </TextComponent>
      <ButtonComponent
        title="Thêm vào giỏ"
        type="primary"
        style={globalStyles.addToCartButton}
        textStyle={globalStyles.addToCartText}
        onPress={() => onAddToCart?.(menuItem)}
      />
    </TouchableOpacity>
  );
};

export default MenuItemComponent;
