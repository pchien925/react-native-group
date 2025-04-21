// @/components/menu/MenuItemsSection.tsx
import React, { memo, useCallback, useEffect } from "react";
import { StyleSheet } from "react-native";
import LoadingComponent from "@/components/common/LoadingComponent";
import MenuItemList from "./MenuItemList";
import { getMenuItemsByCategoryApi } from "@/services/api";
import { router } from "expo-router";

interface MenuItemsSectionProps {
  menuItems: IMenuItem[];
  setMenuItems: React.Dispatch<React.SetStateAction<IMenuItem[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  refreshing: boolean;
  setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  selectedCategory: IMenuCategory | null;
  onAddToCart: (item: IMenuItem) => void;
  setToastMessage: React.Dispatch<React.SetStateAction<string>>;
  setToastType: React.Dispatch<React.SetStateAction<"success" | "error">>;
  setToastVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const MenuItemsSection: React.FC<MenuItemsSectionProps> = ({
  menuItems,
  setMenuItems,
  loading,
  setLoading,
  refreshing,
  setRefreshing,
  page,
  setPage,
  totalPages,
  setTotalPages,
  selectedCategory,
  onAddToCart,
  setToastMessage,
  setToastType,
  setToastVisible,
}) => {
  console.log("MenuItemsSection rendered");

  const fetchMenuItems = useCallback(
    async (pageNum: number, categoryId: number | null) => {
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
          if (response.error?.includes("Current user not found")) {
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
    },
    [setLoading, setTotalPages, setToastMessage, setToastType, setToastVisible]
  );

  useEffect(() => {
    if (selectedCategory) {
      fetchMenuItems(page, selectedCategory.id).then((response) => {
        setMenuItems((prev) =>
          page === 1 ? response.content : [...prev, ...response.content]
        );
      });
    }
  }, [page, selectedCategory, fetchMenuItems, setMenuItems]);

  const handleLoadMore = useCallback(() => {
    if (!loading && page < totalPages && !refreshing) {
      setPage((prev) => prev + 1);
    }
  }, [loading, page, totalPages, refreshing, setPage]);

  const onRefresh = useCallback(() => {
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
  }, [
    selectedCategory,
    fetchMenuItems,
    setMenuItems,
    setTotalPages,
    setRefreshing,
  ]);

  return loading && !menuItems.length && !refreshing ? (
    <LoadingComponent
      loadingText="Đang tải món ăn..."
      style={styles.loadingContainer}
      accessibilityLabel="Đang tải danh sách món ăn"
    />
  ) : (
    <MenuItemList
      menuItems={menuItems}
      loading={loading}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onLoadMore={handleLoadMore}
      onAddToCart={onAddToCart}
    />
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

export default memo(MenuItemsSection);
