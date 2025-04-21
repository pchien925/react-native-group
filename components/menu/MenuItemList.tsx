import React from "react";
import { FlatList, View, StyleSheet, RefreshControl } from "react-native";
import { router } from "expo-router";
import MenuItemComponent from "@/components/MenuItem/MenuItemComponent";
import TextComponent from "@/components/common/TextComponent";
import LoadingComponent from "@/components/common/LoadingComponent"; // Import LoadingComponent
import { Colors } from "@/constants/Colors";
import { ScreenDimensions } from "@/constants/Dimensions";

interface IMenuItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  basePrice: number;
}

interface MenuItemListProps {
  menuItems: IMenuItem[];
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
  onLoadMore: () => void;
  onAddToCart: (item: IMenuItem) => void;
}

const MenuItemList: React.FC<MenuItemListProps> = ({
  menuItems,
  loading,
  refreshing,
  onRefresh,
  onLoadMore,
  onAddToCart,
}) => {
  const width = ScreenDimensions.WIDTH;
  const numColumns = width > 600 ? 3 : 2;

  return (
    <FlatList
      data={menuItems}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <MenuItemComponent
            menuItem={item}
            onPress={() => router.push(`/menu-item/${item.id}`)}
            onAddToCart={() => onAddToCart(item)}
          />
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      numColumns={numColumns}
      key={`grid-${numColumns}`}
      onEndReached={onLoadMore}
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
        loading || refreshing ? (
          <LoadingComponent
            loadingText={refreshing ? "Đang làm mới..." : "Đang tải món ăn..."}
            style={styles.loadingContainer}
            accessibilityLabel={
              refreshing
                ? "Đang làm mới danh sách"
                : "Đang tải danh sách món ăn"
            }
          />
        ) : (
          <TextComponent style={styles.emptyText}>
            Không có món ăn nào trong danh mục này.
          </TextComponent>
        )
      }
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    padding: 8,
    margin: 6,
  },
  emptyText: {
    textAlign: "center",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
  loadingMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
});

export default MenuItemList;
