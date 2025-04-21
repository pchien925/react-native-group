// components/cart/CartScreen.tsx
import React, { useEffect } from "react";
import { FlatList, StyleSheet } from "react-native";
import ContainerComponent from "@/components/common/ContainerComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import CartItemComponent from "@/components/cart/CartItemComponent";
import EmptyCartComponent from "@/components/cart/EmptyCartComponent";
import CartSummaryComponent from "@/components/cart/CartSummaryComponent";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store/store";
import { fetchCart } from "@/store/slices/cartSlice";
import { router } from "expo-router";

const CartScreen = () => {
  const dispatch = useAppDispatch();
  const cart = useSelector((state: RootState) => state.cart.cart);
  const status = useSelector((state: RootState) => state.cart.status);
  const error = useSelector((state: RootState) => state.cart.error);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCart());
    }
  }, [status, dispatch]);

  useEffect(() => {
    // Nếu lỗi là "Current user not found", điều hướng về login
    if (error && error.includes("Current user not found")) {
      router.replace("/login");
    }
  }, [error]);

  const handleCheckout = () => {
    router.push("/(tabs)/checkout");
  };

  return (
    <ContainerComponent style={styles.container}>
      <SpaceComponent size={16} />
      {status === "loading" ? (
        <EmptyCartComponent status="loading" dispatch={dispatch} />
      ) : status === "failed" ? (
        <EmptyCartComponent status="failed" error={error} dispatch={dispatch} />
      ) : !cart ||
        !Array.isArray(cart.cartItems) ||
        cart.cartItems.length === 0 ? (
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
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
});

export default CartScreen;
