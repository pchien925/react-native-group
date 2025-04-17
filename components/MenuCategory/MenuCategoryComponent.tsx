// src/components/home/CategoryItem.tsx
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import TextComponent from "@/components/common/TextComponent";
import AvatarComponent from "@/components/common/AvatarComponent";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/globalStyles";

interface CategoryItemProps {
  category: IMenuCategory;
  isSelected: boolean;
  onPress?: (category: IMenuCategory) => void;
}

const MenuCategoryComponent: React.FC<CategoryItemProps> = ({
  category,
  isSelected,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        globalStyles.menuCategory,
        isSelected && globalStyles.menuCategorySelected, // Áp dụng kiểu khi được chọn
      ]}
      onPress={() => onPress?.(category)}
      accessibilityLabel={category.name}
      accessibilityState={{ selected: isSelected }}
    >
      <AvatarComponent
        imageUrl={category.imageUrl}
        style={[
          globalStyles.menuCategoryImage,
          isSelected ? globalStyles.menuCategoryImageSelected : {}, // Kiểu avatar khi được chọn
        ]}
      />
      <TextComponent
        style={[
          globalStyles.menuCategoryText,
          isSelected ? globalStyles.menuCategoryTextSelected : {}, // Kiểu chữ khi được chọn
        ]}
      >
        {category.name}
      </TextComponent>
    </TouchableOpacity>
  );
};

export default MenuCategoryComponent;
