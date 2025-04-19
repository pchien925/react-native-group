import React from "react";
import { FlatList, View } from "react-native";

import MenuCategoryComponent from "@/components/MenuCategory/MenuCategoryComponent";

interface IMenuCategory {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

interface CategoryListProps {
  categories: IMenuCategory[];
  selectedCategory: IMenuCategory | null;
  onCategoryPress: (category: IMenuCategory) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  onCategoryPress,
}) => {
  return (
    <FlatList
      data={categories}
      renderItem={({ item }) => (
        <View style={{ flex: 1, marginBottom: 24 }}>
          <MenuCategoryComponent
            category={item}
            onPress={() => onCategoryPress(item)}
            isSelected={item.id === selectedCategory?.id}
          />
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default CategoryList;
