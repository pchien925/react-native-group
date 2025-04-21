// @/components/menu/CategorySection.tsx
import React, { memo } from "react";
import CategoryList from "./CategoryList";

interface CategorySectionProps {
  categories: IMenuCategory[];
  selectedCategory: IMenuCategory | null;
  onCategoryPress: (category: IMenuCategory) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({
  categories,
  selectedCategory,
  onCategoryPress,
}) => {
  console.log("CategorySection rendered");
  return (
    <CategoryList
      categories={categories}
      selectedCategory={selectedCategory}
      onCategoryPress={onCategoryPress}
    />
  );
};

export default memo(CategorySection);
