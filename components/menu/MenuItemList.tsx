import React from "react";
import {
  FlatList,
  View,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { router } from "expo-router";
import MenuItemComponent from "@/components/MenuItem/MenuItemComponent";
import TextComponent from "@/components/common/TextComponent";
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
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : null
      }
      ListEmptyComponent={
        !loading && !refreshing ? (
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
});

export default MenuItemList;
