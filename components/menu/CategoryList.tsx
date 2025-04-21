// @/components/menu/CategoryList.tsx
import React, { memo } from "react";
import { FlatList, View } from "react-native";
import MenuCategoryComponent from "@/components/MenuCategory/MenuCategoryComponent";

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
  console.log("CategoryList rendered");

  return (
    <FlatList
      data={categories}
      renderItem={({ item }) => (
        <View style={{ flex: 1 }}>
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
      contentContainerStyle={{ paddingVertical: 16, marginBottom: 8 }}
      getItemLayout={(data, index) => ({
        length: 100, // Ước tính chiều rộng của MenuCategoryComponent (có thể điều chỉnh dựa trên globalStyles.menuCategory)
        offset: 100 * index,
        index,
      })}
    />
  );
};

export default memo(CategoryList);
