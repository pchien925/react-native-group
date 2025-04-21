// @/components/menu/MenuItemList.tsx
import React, { memo } from "react";
import { FlatList, View, StyleSheet, RefreshControl } from "react-native";
import { router } from "expo-router";
import MenuItemComponent from "@/components/MenuItem/MenuItemComponent";
import TextComponent from "@/components/common/TextComponent";
import LoadingComponent from "@/components/common/LoadingComponent";
import { Colors } from "@/constants/Colors";
import { ScreenDimensions } from "@/constants/Dimensions";

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
  console.log("MenuItemList rendered");
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
      keyExtractor={(item, index) => `${item.id}-${index}`}
      showsVerticalScrollIndicator={false}
      numColumns={numColumns}
      key={`grid-${numColumns}`}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      getItemLayout={(data, index) => ({
        length: 200, // Ước tính chiều cao của MenuItemComponent (có thể điều chỉnh dựa trên globalStyles.menuItemItem)
        offset: 200 * Math.floor(index / numColumns),
        index,
      })}
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
          <TextComponent style={styles.emptyText}>
            Không có món ăn nào trong danh mục này.
          </TextComponent>
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
  loadingMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
});

export default memo(MenuItemList);
