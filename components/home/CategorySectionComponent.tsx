import React from "react";
import { StyleSheet, FlatList } from "react-native";
import MenuCategoryComponent from "@/components/MenuCategory/MenuCategoryComponent";
import SectionTitle from "@/components/home/SectionTitleComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import { router } from "expo-router";

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
      <SectionTitle
        title="Thực đơn"
        showButton
        buttonTitle="Xem thực đơn"
        onButtonPress={() => {
          router.push("/menu");
        }}
      />
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      <SpaceComponent size={24} />
    </>
  );
};

export default CategorySectionComponent;
