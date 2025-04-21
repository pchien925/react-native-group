// components/cart/CartScreen.tsx
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
import ToastComponent from "@/components/common/ToastComponent";
import { Colors } from "@/constants/Colors";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store/store";
import { fetchCart } from "@/store/slices/cartSlice";
import { router } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

const CartScreen = () => {
  const dispatch = useAppDispatch();
  const { isDarkMode } = useTheme();
  const cart = useSelector((state: RootState) => state.cart.cart);
  const status = useSelector((state: RootState) => state.cart.status);
  const error = useSelector((state: RootState) => state.cart.error);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "warning" | "error" | "info" | "default";
    visible: boolean;
  }>({
    message: "",
    type: "default",
    visible: false,
  });
  const [showCheckoutConfirm, setShowCheckoutConfirm] = useState(false);

  const showToast = (
    message: string,
    type: "success" | "warning" | "error" | "info" | "default"
  ) => {
    setToast({ message, type, visible: true });
  };

  const hideToast = () => {
    setToast({ ...toast, visible: false });
  };

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCart());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (error) {
      if (error.includes("Current user not found")) {
        router.replace("/login");
      } else {
        showToast(error, "error");
      }
    }
  }, [error]);

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
      ) : !cart || !cart.cartItems || cart.cartItems.length === 0 ? (
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
      <ToastComponent
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
        duration={3000}
      />
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
          Bạn muốn thanh toán {cart?.cartItems.length} món với tổng số tiền{" "}
          {cart?.totalPrice.toLocaleString("vi-VN")} VNĐ?
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
