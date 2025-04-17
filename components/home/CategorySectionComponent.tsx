import React from "react";
import { StyleSheet, FlatList } from "react-native";
import MenuCategoryComponent from "@/components/MenuCategory/MenuCategoryComponent";
import SectionTitle from "@/components/home/CategoryTitleComponent";
import SpaceComponent from "@/components/common/SpaceComponent";

interface CategorySectionProps {
  categories: IMenuCategory[];
  selectedCategoryId: number | null;
  onCategoryPress: (categoryId: number) => void;
}

const CategorySectionComponent: React.FC<CategorySectionProps> = ({
  categories,
  selectedCategoryId,
  onCategoryPress,
}) => {
  const renderCategory = ({ item }: { item: IMenuCategory }) => (
    <MenuCategoryComponent
      category={item}
      onPress={() => {
        console.log(`Navigate to category: ${item.name}`);
        onCategoryPress(item.id);
      }}
      isSelected={item.id === selectedCategoryId}
    />
  );

  return (
    <>
      <SectionTitle title="Danh Mục Sản Phẩm" />
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
      />
      <SpaceComponent size={24} />
    </>
  );
};

const styles = StyleSheet.create({
  categoryList: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});

export default CategorySectionComponent;
