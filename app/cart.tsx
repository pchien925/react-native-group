import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import ContainerComponent from "@/components/common/ContainerComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import CartItemComponent from "@/components/cart/CartItemComponent";
import EmptyCartComponent from "@/components/cart/EmptyCartComponent";
import CartSummaryComponent from "@/components/cart/CartSummaryComponent";
import ModalComponent from "@/components/common/ModalComponent";
import ButtonComponent from "@/components/common/ButtonComponent";
import TextComponent from "@/components/common/TextComponent";
import RowComponent from "@/components/common/RowComponent";
import { Colors } from "@/constants/Colors";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store/store";
import { fetchCart, resetCart } from "@/store/slices/cartSlice";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import Toast from "react-native-toast-message";

const CartScreen = () => {
  const dispatch = useAppDispatch();
  const { isDarkMode } = useTheme();
  const cart = useSelector((state: RootState) => state.cart.cart);
  const status = useSelector((state: RootState) => state.cart.status);
  const error = useSelector((state: RootState) => state.cart.error);

  const [showCheckoutConfirm, setShowCheckoutConfirm] = useState(false);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      if (error.includes("Current user not found")) {
        dispatch(resetCart());
        router.replace("/login");
      } else {
        Toast.show({
          type: "error",
          text1: error,
          visibilityTime: 3000,
        });
      }
    }
  }, [error, dispatch]);

  const handleCheckout = () => {
    setShowCheckoutConfirm(true);
  };

  const confirmCheckout = () => {
    setShowCheckoutConfirm(false);
    router.push("/checkout");
  };

  return (
    <ContainerComponent style={styles.container}>
      <SpaceComponent size={16} />
      {status === "loading" ? (
        <EmptyCartComponent status="loading" dispatch={dispatch} />
      ) : status === "failed" ? (
        <EmptyCartComponent status="failed" error={error} dispatch={dispatch} />
      ) : !cart?.cartItems?.length ? (
        <EmptyCartComponent status="empty" dispatch={dispatch} />
      ) : (
        <>
          <FlatList
            data={cart.cartItems}
            renderItem={({ item }) => <CartItemComponent item={item} />}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<SpaceComponent size={16} />}
            initialNumToRender={10}
            maxToRenderPerBatch={5}
            windowSize={5}
            removeClippedSubviews={true}
          />
          <CartSummaryComponent
            totalPrice={cart.totalPrice}
            onCheckout={handleCheckout}
          />
        </>
      )}
      <ModalComponent
        visible={showCheckoutConfirm}
        title="Xác nhận thanh toán"
        onClose={() => setShowCheckoutConfirm(false)}
      >
        <TextComponent
          type="body"
          style={{
            color: isDarkMode
              ? Colors.textDarkPrimary
              : Colors.textLightPrimary,
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          Bạn muốn thanh toán {cart?.cartItems?.length || 0} món với tổng số
          tiền {cart?.totalPrice.toLocaleString("vi-VN")} VNĐ?
        </TextComponent>
        <RowComponent justifyContent="space-between">
          <ButtonComponent
            title="Hủy"
            type="outline"
            onPress={() => setShowCheckoutConfirm(false)}
            style={styles.modalButton}
            textStyle={styles.modalButtonText}
            accessibilityLabel="Hủy thanh toán"
          />
          <ButtonComponent
            title="Thanh toán"
            type="primary"
            onPress={confirmCheckout}
            style={styles.modalButton}
            textStyle={styles.modalButtonText}
            accessibilityLabel="Xác nhận thanh toán"
          />
        </RowComponent>
      </ModalComponent>
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 10,
  },
  modalButtonText: {
    fontSize: 14,
  },
});

export default CartScreen;
