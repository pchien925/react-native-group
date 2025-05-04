import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, FlatList, View, RefreshControl, Text } from "react-native";
import { router } from "expo-router";
import ContainerComponent from "@/components/common/ContainerComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import MenuItemComponent from "@/components/MenuItem/MenuItemComponent";
import ItemCustomizationModal from "@/components/menu/ItemCustomizationModal";
import LoadingComponent from "@/components/common/LoadingComponent";
import { getWishlistApi, getOptionsByMenuItemApi } from "@/services/api";
import { Colors } from "@/constants/Colors";
import { ScreenDimensions } from "@/constants/Dimensions";
import { useTheme } from "@/contexts/ThemeContext";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { addToCart } from "@/store/slices/cartSlice";
import Toast from "react-native-toast-message";

const WishlistScreen = () => {
  const [wishlistItems, setWishlistItems] = useState<IMenuItem[]>([]);
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
  const userId = useAppSelector((state) => state.auth.user?.id);

  const fetchWishlist = async (pageNum: number) => {
    if (!userId) {
      router.replace("/login");
      return;
    }
    setLoading(true);
    try {
      const pageSize = 10;
      const response = await getWishlistApi(
        userId,
        pageNum,
        pageSize,
        "id",
        "asc"
      );
      if (response.error || !response.data) {
        throw new Error(response.message || "Failed to fetch wishlist");
      }
      setTotalPages(response.data.totalPages);
      return response.data;
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message || "Không thể tải danh sách yêu thích",
        visibilityTime: 1200,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist(page).then((response) => {
      if (response) {
        setWishlistItems((prev) =>
          page === 1 ? response.content : [...prev, ...response.content]
        );
      }
    });
  }, [page]);

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
      setOptions(validOptions);
      setModalVisible(true);
    } catch (error: any) {
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
    if (
      !loading &&
      page < totalPages &&
      !refreshing &&
      wishlistItems.length > 0
    ) {
      setPage((prev) => prev + 1);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setWishlistItems([]);
    setPage(1);
    fetchWishlist(1).then((response) => {
      if (response) {
        setWishlistItems(response.content);
        setTotalPages(response.totalPages);
      }
      setRefreshing(false);
    });
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
      {loading && !wishlistItems.length && !refreshing ? (
        <LoadingComponent
          loadingText="Đang tải danh sách yêu thích..."
          style={styles.loadingContainer}
          accessibilityLabel="Đang tải danh sách yêu thích"
        />
      ) : (
        <FlatList
          data={wishlistItems}
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
            wishlistItems.length === 0 && !loading && !refreshing ? (
              <Text style={styles.emptyText}>
                Danh sách yêu thích của bạn đang trống.
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

export default WishlistScreen;
