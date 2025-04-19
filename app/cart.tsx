import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import ContainerComponent from "@/components/common/ContainerComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import TextComponent from "@/components/common/TextComponent";
import ButtonComponent from "@/components/common/ButtonComponent";
import ImageComponent from "@/components/common/ImageComponent";
import RowComponent from "@/components/common/RowComponent";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/global.styles";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store/store";
import {
  fetchCart,
  updateQuantity,
  removeFromCart,
} from "@/store/slices/cartSlice";
import { router } from "expo-router";

// Interfaces
interface IMenuItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  basePrice: number;
}

interface IOptionValue {
  id: number;
  value: string;
  additionalPrice: number;
}

interface ICartItem {
  id: number;
  quantity: number;
  priceAtAddition: number;
  menuItem: IMenuItem;
  options: IOptionValue[];
}

interface ICart {
  id: number;
  cartItems: ICartItem[];
  totalPrice: number;
}

// Separate CartItem component for rendering each item
const CartItem: React.FC<{
  item: ICartItem;
  dispatch: ReturnType<typeof useAppDispatch>;
}> = ({ item, dispatch }) => {
  return (
    <View
      style={[
        globalStyles.card,
        styles.cartItemContainer,
        {
          backgroundColor: Colors.backgroundLight,
          borderColor: Colors.borderLight,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => dispatch(removeFromCart(item.id))}
        accessibilityLabel="Xóa món"
        accessibilityRole="button"
      >
        <Ionicons name="close" size={18} color={Colors.accent} />
      </TouchableOpacity>
      <ImageComponent
        source={{ uri: item.menuItem.imageUrl }}
        style={styles.cartItemImage}
      />
      <View style={styles.cartItemDetails}>
        <TextComponent type="subheading" style={styles.cartItemName}>
          {item.menuItem.name}
        </TextComponent>
        <TextComponent type="caption" style={styles.cartItemOptions}>
          {item.options.map((opt) => opt.value).join(", ")}
        </TextComponent>
        <TextComponent type="body" style={styles.cartItemPrice}>
          {(item.priceAtAddition * item.quantity).toLocaleString("vi-VN")} VNĐ
        </TextComponent>
      </View>
      <View style={styles.quantityContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.quantityButton,
            {
              backgroundColor: Colors.white,
              borderColor: Colors.borderLight,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          onPress={() =>
            dispatch(
              updateQuantity({
                cartItemId: item.id,
                quantity: item.quantity - 1,
              })
            )
          }
        >
          <TextComponent style={styles.quantityButtonText}>-</TextComponent>
        </Pressable>
        <TextComponent type="body" style={styles.quantityText}>
          {item.quantity}
        </TextComponent>
        <Pressable
          style={({ pressed }) => [
            styles.quantityButton,
            {
              backgroundColor: Colors.white,
              borderColor: Colors.borderLight,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
          onPress={() =>
            dispatch(
              updateQuantity({
                cartItemId: item.id,
                quantity: item.quantity + 1,
              })
            )
          }
        >
          <TextComponent style={styles.quantityButtonText}>+</TextComponent>
        </Pressable>
      </View>
    </View>
  );
};

const CartScreen = () => {
  console.log("CartScreen rendered");
  const { isDarkMode } = useTheme();
  const dispatch = useAppDispatch();
  const cart = useSelector((state: RootState) => state.cart.cart);
  const status = useSelector((state: RootState) => state.cart.status);
  const error = useSelector((state: RootState) => state.cart.error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCart());
    }
  }, [status, dispatch]);

  const handleCheckout = () => {
    console.log("Thanh toán giỏ hàng:", {
      cart,
      total: cart?.totalPrice,
    });
  };

  return (
    <ContainerComponent style={styles.container}>
      <RowComponent
        style={[
          globalStyles.header,
          styles.headerContainer,
          {
            backgroundColor: isDarkMode
              ? Colors.backgroundDark
              : Colors.backgroundLight,
          },
        ]}
        alignItems="center"
      >
        <TouchableOpacity
          style={globalStyles.backButton}
          onPress={() => router.back()}
          accessibilityLabel="Quay lại"
          accessibilityRole="button"
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={
              isDarkMode ? Colors.textDarkPrimary : Colors.textLightPrimary
            }
          />
        </TouchableOpacity>
        <TextComponent type="subheading" style={styles.title}>
          Giỏ hàng
          {cart && cart.cartItems.length > 0
            ? `(${cart.cartItems.length})`
            : ""}
        </TextComponent>
      </RowComponent>
      <SpaceComponent size={16} />
      {status === "loading" ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="refresh-circle-outline"
            size={60}
            color={Colors.accent}
          />
          <TextComponent type="subheading" style={styles.emptyText}>
            Đang tải giỏ hàng...
          </TextComponent>
        </View>
      ) : status === "failed" ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={60}
            color={Colors.accent}
          />
          <TextComponent type="subheading" style={styles.emptyText}>
            Lỗi: {error}
          </TextComponent>
        </View>
      ) : !cart || cart.cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={60} color={Colors.accent} />
          <TextComponent type="subheading" style={styles.emptyText}>
            Giỏ hàng của bạn đang trống
          </TextComponent>
          <TextComponent type="body" style={styles.emptySubText}>
            Hãy thêm món ăn từ thực đơn để bắt đầu!
          </TextComponent>
          <RowComponent style={styles.emptyButtonContainer}>
            <ButtonComponent
              title="Xem thực đơn"
              type="primary"
              onPress={() => router.push("/(tabs)/menu")}
              style={styles.exploreButton}
              accessibilityLabel="Xem thực đơn"
            />
            <ButtonComponent
              title="Khám phá ưu đãi"
              type="outline"
              onPress={() => router.push("/(tabs)/home")}
              style={styles.offerButton}
              accessibilityLabel="Khám phá ưu đãi"
            />
          </RowComponent>
        </View>
      ) : (
        <>
          <FlatList
            data={cart.cartItems}
            renderItem={({ item }) => (
              <CartItem item={item} dispatch={dispatch} />
            )}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<SpaceComponent size={16} />}
          />
          <View
            style={[
              globalStyles.card,
              styles.summaryContainer,
              {
                backgroundColor: isDarkMode
                  ? Colors.backgroundDark
                  : Colors.backgroundLight,
              },
            ]}
          >
            <RowComponent
              style={styles.totalRow}
              alignItems="center"
              justifyContent="flex-end"
            >
              <TextComponent type="subheading" style={styles.summaryText}>
                Tổng cộng: {cart.totalPrice.toLocaleString("vi-VN")} VNĐ
              </TextComponent>
            </RowComponent>
            <ButtonComponent
              title="Thanh toán"
              type="primary"
              onPress={handleCheckout}
              style={styles.checkoutButton}
              accessibilityLabel="Thanh toán giỏ hàng"
            />
          </View>
        </>
      )}
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0, // Override default padding from globalStyles.container
  },
  headerContainer: {
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
  },
  backButton: {
    marginBottom: 0, // Override globalStyles.backButton
    padding: 2,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
    marginHorizontal: 16,
    padding: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubText: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
  },
  emptyButtonContainer: {
    marginTop: 16,
    gap: 8,
  },
  exploreButton: {
    width: 140,
    paddingVertical: 10,
    borderRadius: 8,
  },
  offerButton: {
    width: 140,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cartItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    position: "relative", // For absolute positioning of buttons
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: 4,
    zIndex: 1,
  },
  cartItemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  cartItemDetails: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: "600",
  },
  cartItemOptions: {
    marginTop: 6,
    fontSize: 12,
  },
  cartItemPrice: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 8,
    right: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 4,
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  quantityText: {
    fontSize: 14,
    fontWeight: "600",
    width: 24,
    textAlign: "center",
  },
  removeButton: {
    padding: 8,
  },
  summaryContainer: {
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
  },
  totalRow: {
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "600",
  },
  checkoutButton: {
    paddingVertical: 12,
    borderRadius: 8,
  },
});

export default CartScreen;
