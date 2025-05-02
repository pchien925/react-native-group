import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, FlatList, View, RefreshControl, Text } from "react-native";
import { router } from "expo-router";
import ContainerComponent from "@/components/common/ContainerComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import MenuCategoryComponent from "@/components/MenuCategory/MenuCategoryComponent";
import MenuItemComponent from "@/components/MenuItem/MenuItemComponent";
import ItemCustomizationModal from "@/components/menu/ItemCustomizationModal";
import LoadingComponent from "@/components/common/LoadingComponent";
import {
  getMenuCategoriesApi,
  getMenuItemsApi,
  getMenuItemsByCategoryApi,
  getOptionsByMenuItemApi,
} from "@/services/api";
import { Colors } from "@/constants/Colors";
import { ScreenDimensions } from "@/constants/Dimensions";
import { useTheme } from "@/contexts/ThemeContext";
import { useAppDispatch } from "@/store/store";
import { addToCart } from "@/store/slices/cartSlice";
import Toast from "react-native-toast-message";

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

  const { isDarkMode } = useTheme();
  const dispatch = useAppDispatch();

  const fetchCategories = async () => {
    console.log("Fetching categories...");
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
      } else {
        Toast.show({
          type: "error",
          text1: "Không có danh mục nào khả dụng",
          visibilityTime: 1200,
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message || "Không thể tải danh mục",
        visibilityTime: 1200,
      });
    }
  };

  const fetchAllMenuItems = async (pageNum: number) => {
    setLoading(true);
    try {
      const pageSize = 10;
      const response = await getMenuItemsApi(pageNum, pageSize, "id", "asc");
      if (response.error || !response.data) {
        if (response.error?.includes("Current user not found")) {
          router.replace("/login");
        }
        throw new Error(response.message || "Failed to fetch menu items");
      }
      setTotalPages(response.data.totalPages);
      return response.data;
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message || "Không thể tải món ăn",
        visibilityTime: 1200,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItemsByCategory = async (
    pageNum: number,
    categoryId: number
  ) => {
    setLoading(true);
    try {
      const pageSize = 10;
      const response = await getMenuItemsByCategoryApi(
        categoryId,
        pageNum,
        pageSize,
        "id",
        "asc"
      );
      if (response.error || !response.data) {
        if (response.error?.includes("Current user not found")) {
          router.replace("/login");
        }
        throw new Error(response.message || "Failed to fetch menu items");
      }
      setTotalPages(response.data.totalPages);
      return response.data;
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message || "Không thể tải món ăn",
        visibilityTime: 1200,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    console.log("Selected category changed:", selectedCategory);
    console.log("Page changed:", page);
    if (!selectedCategory) {
      fetchAllMenuItems(page).then((response) => {
        setMenuItems((prev) =>
          page === 1 ? response.content : [...prev, ...response.content]
        );
      });
    } else {
      fetchMenuItemsByCategory(page, selectedCategory.id).then((response) => {
        setMenuItems((prev) =>
          page === 1 ? response.content : [...prev, ...response.content]
        );
      });
    }
  }, [page, selectedCategory]);

  const handleCategoryPress = (category: IMenuCategory) => {
    setSelectedCategory(category);
    setMenuItems([]);
    setPage(1);
  };

  const handleAddToCart = async (item: IMenuItem) => {
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
      console.log("Options from API:", response.data);
      setOptions(validOptions);
      setModalVisible(true);
    } catch (error: any) {
      console.error("Error fetching options:", error);
      Toast.show({
        type: "error",
        text1: error.message || "Không thể tải tùy chọn món ăn",
        visibilityTime: 1200,
      });
    } finally {
      setOptionsLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && page < totalPages && !refreshing && menuItems.length > 0) {
      console.log("Loading more, current page:", page);
      setPage((prev) => prev + 1);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setMenuItems([]);
    setPage(1);
    if (selectedCategory) {
      fetchMenuItemsByCategory(1, selectedCategory.id).then((response) => {
        setMenuItems(response.content);
        setTotalPages(response.totalPages);
        setRefreshing(false);
      });
    } else {
      setRefreshing(false);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedItem(null);
    setSelectedOptions({});
    setQuantity(1);
    setOptions([]);
  };

  const handleConfirmAdd = useCallback(() => {
    if (selectedItem) {
      if (Object.keys(selectedOptions).length === 0 && options.length > 0) {
        Toast.show({
          type: "error",
          text1: "Vui lòng chọn ít nhất một tùy chọn.",
          visibilityTime: 1200,
        });
        return;
      }
      dispatch(
        addToCart({
          menuItemId: selectedItem.id,
          quantity,
          options: Object.values(selectedOptions),
        })
      ).then((action) => {
        if (addToCart.fulfilled.match(action)) {
          Toast.show({
            type: "success",
            text1: `${selectedItem.name} đã được thêm vào giỏ hàng!`,
            visibilityTime: 1200,
          });
        } else {
          Toast.show({
            type: "error",
            text1: (action.payload as string) || "Không thể thêm vào giỏ hàng",
            visibilityTime: 1200,
          });
        }
      });
      handleModalClose();
    }
  }, [dispatch, selectedItem, selectedOptions, options, quantity]);

  const width = ScreenDimensions.WIDTH;
  const numColumns = width > 600 ? 3 : 2;

  return (
    <ContainerComponent>
      {/* Category List */}
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <View style={{ flex: 1 }}>
            <MenuCategoryComponent
              category={item}
              onPress={() => handleCategoryPress(item)}
              isSelected={item.id === selectedCategory?.id}
            />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 16, marginBottom: 8 }}
      />
      <SpaceComponent size={16} />
      {/* Menu Items List */}
      {loading && !menuItems.length && !refreshing ? (
        <LoadingComponent
          loadingText="Đang tải món ăn..."
          style={styles.loadingContainer}
          accessibilityLabel="Đang tải danh sách món ăn"
        />
      ) : (
        <FlatList
          data={menuItems}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <MenuItemComponent
                menuItem={item}
                onPress={() => router.push(`/menu-item/${item.id}`)}
                onAddToCart={() => handleAddToCart(item)}
              />
            </View>
          )}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          showsVerticalScrollIndicator={false}
          numColumns={numColumns}
          key={`grid-${numColumns}`}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && !refreshing ? (
              <LoadingComponent
                loadingText="Đang tải thêm món ăn..."
                size="small"
                style={styles.loadingMoreContainer}
                accessibilityLabel="Đang tải thêm món ăn"
              />
            ) : null
          }
          ListEmptyComponent={
            menuItems.length === 0 && !loading && !refreshing ? (
              <Text style={styles.emptyText}>
                Không có món ăn nào trong danh mục này.
              </Text>
            ) : null
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.primary}
            />
          }
        />
      )}
      <ItemCustomizationModal
        visible={modalVisible}
        item={selectedItem}
        options={options}
        categoryId={null}
        onClose={handleModalClose}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        quantity={quantity}
        setQuantity={setQuantity}
        onConfirm={handleConfirmAdd}
        isDarkMode={isDarkMode}
        loading={optionsLoading}
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
  itemContainer: {
    flex: 1,
    padding: 8,
    margin: 6,
  },
  emptyText: {
    textAlign: "center",
    padding: 20,
  },
  loadingMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
});

export default MenuScreen;
