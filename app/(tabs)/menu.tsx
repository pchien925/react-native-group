import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import ContainerComponent from "@/components/common/ContainerComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import ToastComponent from "@/components/common/ToastComponent";
import LoadingComponent from "@/components/common/LoadingComponent";
import CategoryList from "@/components/menu/CategoryList";
import MenuItemList from "@/components/menu/MenuItemList";
import ItemCustomizationModal from "@/components/menu/ItemCustomizationModal";
import { useAppDispatch } from "@/store/store";
import { addToCart } from "@/store/slices/cartSlice";
import {
  getMenuCategoriesApi,
  getMenuItemsByCategoryApi,
} from "@/services/api";
import { router } from "expo-router";

const MenuScreen = () => {
  console.log("MenuScreen rendered");
  const { isDarkMode } = useTheme();
  const dispatch = useAppDispatch();
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
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Lấy danh mục từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getMenuCategoriesApi();
        if (response.error || !response.data) {
          if (
            response.error &&
            response.error.includes("Current user not found")
          ) {
            router.replace("/login");
          }
          throw new Error(response.message || "Failed to fetch categories");
        }
        setCategories(response.data);
        setSelectedCategory(response.data[0] || null);
      } catch (error: any) {
        setToastMessage(error.message || "Không thể tải danh mục");
        setToastType("error");
        setToastVisible(true);
      }
    };
    fetchCategories();
  }, []);

  // Lấy món ăn từ API
  const fetchMenuItems = async (pageNum: number, categoryId: number | null) => {
    setLoading(true);
    try {
      const pageSize = 10;
      const response = await getMenuItemsByCategoryApi(
        pageNum,
        pageSize,
        categoryId || 0,
        "id",
        "asc"
      );
      if (response.error || !response.data) {
        if (
          response.error &&
          response.error.includes("Current user not found")
        ) {
          router.replace("/login");
        }
        throw new Error(response.message || "Failed to fetch menu items");
      }
      setTotalPages(response.data.totalPages);
      return response.data;
    } catch (error: any) {
      setToastMessage(error.message || "Không thể tải món ăn");
      setToastType("error");
      setToastVisible(true);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchMenuItems(page, selectedCategory.id).then((response) => {
        setMenuItems((prev) =>
          page === 1 ? response.content : [...prev, ...response.content]
        );
      });
    }
  }, [page, selectedCategory]);

  const handleLoadMore = () => {
    if (!loading && page < totalPages && !refreshing) {
      setPage((prev) => prev + 1);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setMenuItems([]);
    setPage(1);
    if (selectedCategory) {
      fetchMenuItems(1, selectedCategory.id).then((response) => {
        setMenuItems(response.content);
        setTotalPages(response.totalPages);
        setRefreshing(false);
      });
    } else {
      setRefreshing(false);
    }
  };

  const handleCategoryPress = (category: IMenuCategory) => {
    setSelectedCategory(category);
    setMenuItems([]);
    setPage(1);
  };

  const handleAddToCart = (item: IMenuItem) => {
    setSelectedItem(item);
    setSelectedOptions({});
    setQuantity(1);
    setModalVisible(true);
  };

  const handleConfirmAdd = () => {
    if (selectedItem) {
      if (Object.keys(selectedOptions).length === 0) {
        setToastMessage("Vui lòng chọn ít nhất một tùy chọn.");
        setToastType("error");
        setToastVisible(true);
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
          setToastMessage(`${selectedItem.name} đã được thêm vào giỏ hàng!`);
          setToastType("success");
        } else {
          setToastMessage(
            (action.payload as string) || "Không thể thêm vào giỏ hàng"
          );
          setToastType("error");
        }
        setToastVisible(true);
      });
      setModalVisible(false);
    }
  };

  const handleToastHide = () => {
    setToastVisible(false);
    setToastMessage("");
    setToastType("success");
  };

  return (
    <ContainerComponent>
      {loading && !menuItems.length && !refreshing ? (
        <LoadingComponent
          loadingText="Đang tải món ăn..."
          style={styles.loadingContainer}
          accessibilityLabel="Đang tải danh sách món ăn"
        />
      ) : (
        <>
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryPress={handleCategoryPress}
          />
          <SpaceComponent size={16} />
          <MenuItemList
            menuItems={menuItems}
            loading={loading}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onLoadMore={handleLoadMore}
            onAddToCart={handleAddToCart}
          />
        </>
      )}
      <ItemCustomizationModal
        visible={modalVisible}
        item={selectedItem}
        categoryId={null}
        onClose={() => setModalVisible(false)}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        quantity={quantity}
        setQuantity={setQuantity}
        onConfirm={handleConfirmAdd}
        isDarkMode={isDarkMode}
      />
      <Modal
        animationType="none"
        transparent={true}
        visible={toastVisible}
        onRequestClose={handleToastHide}
      >
        <View style={styles.toastModalContainer}>
          <ToastComponent
            message={toastMessage}
            type={toastType}
            visible={toastVisible}
            onHide={handleToastHide}
            duration={1200}
          />
        </View>
      </Modal>
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  toastModalContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
});

export default MenuScreen;
