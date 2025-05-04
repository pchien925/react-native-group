// components/menu/MenuItemComponent.tsx
import React, { useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import ImageComponent from "@/components/common/ImageComponent";
import TextComponent from "@/components/common/TextComponent";
import ButtonComponent from "@/components/common/ButtonComponent";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/global.styles";
import { MaterialIcons } from "@expo/vector-icons";
import {
  addToWishlistApi,
  removeFromWishlistApi,
  getWishlistByItemIdApi,
} from "@/services/api"; // Updated import
import { useAppSelector } from "@/store/store";

interface IMenuItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  basePrice: number;
}

interface MenuItemProps {
  menuItem: IMenuItem;
  onPress?: (menuItem: IMenuItem) => void;
  onAddToCart?: (menuItem: IMenuItem) => void;
}

const MenuItemComponent: React.FC<MenuItemProps> = ({
  menuItem,
  onPress,
  onAddToCart,
}) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const userId = useAppSelector((state) => state.auth.user?.id);

  // Fetch wishlist status on mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!userId) return;
      try {
        const response = await getWishlistByItemIdApi(userId, menuItem.id);
        if (response.data) {
          setIsInWishlist(true); // Item exists in wishlist
        } else {
          setIsInWishlist(false); // Item not in wishlist
        }
      } catch (error) {
        console.error("Error checking wishlist status:", error);
        setIsInWishlist(false); // Default to false on error
      }
    };
    checkWishlistStatus();
  }, [userId, menuItem.id]);

  const toggleWishlist = async () => {
    if (!userId) {
      console.error("User not logged in");
      return;
    }
    try {
      if (isInWishlist) {
        await removeFromWishlistApi(userId, menuItem.id);
        setIsInWishlist(false);
      } else {
        await addToWishlistApi(userId, menuItem.id);
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error("Wishlist toggle error:", error);
    }
  };

  return (
    <TouchableOpacity
      style={globalStyles.menuItemItem}
      onPress={() => onPress && onPress(menuItem)}
      accessibilityLabel={menuItem.name}
    >
      <View style={styles.wishlistContainer}>
        <TouchableOpacity
          onPress={toggleWishlist}
          style={styles.wishlistButton}
          disabled={!userId}
        >
          <MaterialIcons
            name={isInWishlist ? "favorite" : "favorite-border"}
            size={18}
            color={isInWishlist ? Colors.primary : Colors.disabled}
          />
        </TouchableOpacity>
      </View>
      <ImageComponent
        source={{ uri: menuItem.imageUrl }}
        style={globalStyles.menuItemImage}
        resizeMode="cover"
      />
      <TextComponent style={globalStyles.menuItemName}>
        {menuItem.name}
      </TextComponent>
      <TextComponent style={globalStyles.menuItemPrice}>
        {menuItem.basePrice.toLocaleString("vi-VN")} VNĐ
      </TextComponent>
      <TextComponent style={globalStyles.menuItemDescription} numberOfLines={2}>
        {menuItem.description}
      </TextComponent>
      <ButtonComponent
        title="Thêm vào giỏ"
        type="primary"
        style={globalStyles.addToCartButton}
        textStyle={globalStyles.addToCartText}
        onPress={() => onAddToCart && onAddToCart(menuItem)}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wishlistContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  wishlistButton: {
    padding: 4,
    backgroundColor: Colors.white,
    borderRadius: 20,
  },
});

export default MenuItemComponent;
