// screens/MenuScreen.tsx
import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet } from "react-native";
import ContainerComponent from "@/components/common/ContainerComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import CategorySection from "@/components/menu/CategorySection";
import MenuItemsSection from "@/components/menu/MenuItemsSection";
import ModalSection from "@/components/menu/ModalSection";
import ToastSection from "@/components/menu/ToastSection";
import { getMenuCategoriesApi, getOptionsByMenuItemApi } from "@/services/api";
import { router } from "expo-router";

const MenuScreen = () => {
  console.log("MenuScreen rendered");
  const [categories, setCategories] = useState<IMenuCategory[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<IMenuCategory | null>(null);
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IMenuItem | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: IOptionValue;
  }>({});
  const [quantity, setQuantity] = useState(1);
  const [options, setOptions] = useState<IOption[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Lấy danh mục từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getMenuCategoriesApi();
        if (response.error || !response.data) {
          if (response.error?.includes("Current user not found")) {
            router.replace("/login");
          }
          throw new Error(response.message || "Failed to fetch categories");
        }
        if (response.data.length > 0) {
          setCategories(response.data);
          setSelectedCategory(response.data[0]);
        } else {
          setToastMessage("Không có danh mục nào khả dụng");
          setToastType("error");
          setToastVisible(true);
        }
      } catch (error: any) {
        setToastMessage(error.message || "Không thể tải danh mục");
        setToastType("error");
        setToastVisible(true);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryPress = useCallback((category: IMenuCategory) => {
    setSelectedCategory(category);
    setMenuItems([]);
    setPage(1);
  }, []);

  const handleAddToCart = useCallback(async (item: IMenuItem) => {
    setSelectedItem(item);
    setSelectedOptions({});
    setQuantity(1);
    setOptionsLoading(true);
    try {
      const response = await getOptionsByMenuItemApi(item.id);
      if (response.error || !response.data) {
        throw new Error(response.message || "Failed to fetch options");
      }
      const validOptions = response.data.filter(
        (option) =>
          option.menuItemOption && Array.isArray(option.menuItemOption)
      );
      console.log("Options from API:", response.data); // Debug
      setOptions(validOptions);
      setModalVisible(true);
    } catch (error: any) {
      console.error("Error fetching options:", error);
      setToastMessage(error.message || "Không thể tải tùy chọn món ăn");
      setToastType("error");
      setToastVisible(true);
    } finally {
      setOptionsLoading(false);
    }
  }, []);

  const handleModalClose = useCallback(() => {
    setModalVisible(false);
    setSelectedItem(null);
    setSelectedOptions({});
    setQuantity(1);
    setOptions([]);
  }, []);

  const handleToastHide = useCallback(() => {
    setToastVisible(false);
    setToastMessage("");
    setToastType("success");
  }, []);

  return (
    <ContainerComponent>
      <CategorySection
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryPress={handleCategoryPress}
      />
      <SpaceComponent size={16} />
      <MenuItemsSection
        menuItems={menuItems}
        setMenuItems={setMenuItems}
        loading={loading}
        setLoading={setLoading}
        refreshing={refreshing}
        setRefreshing={setRefreshing}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        setTotalPages={setTotalPages}
        selectedCategory={selectedCategory}
        onAddToCart={handleAddToCart}
        setToastMessage={setToastMessage}
        setToastType={setToastType}
        setToastVisible={setToastVisible}
      />
      <ModalSection
        visible={modalVisible}
        item={selectedItem}
        options={options}
        optionsLoading={optionsLoading}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        quantity={quantity}
        setQuantity={setQuantity}
        onClose={handleModalClose}
        setToastMessage={setToastMessage}
        setToastType={setToastType}
        setToastVisible={setToastVisible}
      />
      <ToastSection
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
        onHide={handleToastHide}
      />
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
});

export default MenuScreen;
