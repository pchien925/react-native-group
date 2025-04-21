// screens/CheckoutScreen.tsx
import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import ContainerComponent from "@/components/common/ContainerComponent";
import TextComponent from "@/components/common/TextComponent";
import ButtonComponent from "@/components/common/ButtonComponent";
import InputComponent from "@/components/common/InputComponent";
import ModalComponent from "@/components/common/ModalComponent";
import ToastComponent from "@/components/common/ToastComponent";
import RowComponent from "@/components/common/RowComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/global.styles";
import { useTheme } from "@/contexts/ThemeContext";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store/store";
import { createOrder, resetCart } from "@/store/slices/cartSlice";
import { getCurrentUser } from "@/store/slices/authSlice";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

interface AuthState {
  user: IUser | null;
}

/**
 * Checkout screen for processing cart payment and order creation.
 */
const CheckoutScreen: React.FC = () => {
  const { isDarkMode } = useTheme();
  const dispatch = useAppDispatch();
  const cart = useSelector((state: RootState) => state.cart.cart);
  const status = useSelector((state: RootState) => state.cart.status);
  const error = useSelector((state: RootState) => state.cart.error);
  const user = useSelector((state: RootState) => state.auth.user);
  const [paymentMethod, setPaymentMethod] = useState<
    "COD" | "VNPAY" | "MOMO" | "BANK_TRANSFER" | "CREDIT_CARD"
  >("COD");
  const [shippingAddress, setShippingAddress] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [branchId, setBranchId] = useState<number>(1); // Giả định tạm thời
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  useEffect(() => {
    if (!cart || cart.cartItems.length === 0) {
      router.replace("/(tabs)/cart"); // Chuyển hướng về giỏ hàng nếu rỗng
    }
    if (!user) {
      dispatch(getCurrentUser()); // Lấy thông tin người dùng nếu chưa có
    }
  }, [cart, user, dispatch]);

  const handleConfirmOrder = () => {
    setShowConfirm(true);
  };

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      setToastMessage("Vui lòng nhập địa chỉ giao hàng");
      setToastType("error");
      setShowToast(true);
      return;
    }
    if (!user) {
      setToastMessage("Vui lòng đăng nhập để tiếp tục");
      setToastType("error");
      setShowToast(true);
      router.replace("/login");
      return;
    }

    try {
      const orderData = {
        cartId: cart!.id,
        shippingAddress,
        note,
        paymentMethod,
        userId: user.id,
        branchId,
      };

      const result = await dispatch(createOrder(orderData)).unwrap();
      setShowConfirm(false);
      setToastMessage(
        `Đặt hàng thành công! Mã đơn hàng: ${result.data?.orderCode}`
      );
      setToastType("success");
      setShowToast(true);
      setTimeout(() => router.push("/(tabs)/orders"), 2000); // Chuyển hướng đến màn hình đơn hàng
    } catch (err: any) {
      setShowConfirm(false);
      setToastMessage(`Đặt hàng thất bại: ${err || "Lỗi không xác định"}`);
      setToastType("error");
      setShowToast(true);
    }
  };

  const renderCartItem = ({ item }: { item: ICartItem }) => (
    <RowComponent style={styles.cartItem}>
      <TextComponent type="body" style={styles.cartItemName}>
        {item.menuItem.name} x {item.quantity}
      </TextComponent>
      <TextComponent type="body" style={styles.cartItemPrice}>
        {(item.priceAtAddition * item.quantity).toLocaleString("vi-VN")} VNĐ
      </TextComponent>
    </RowComponent>
  );

  const paymentMethods: Array<
    "COD" | "VNPAY" | "MOMO" | "BANK_TRANSFER" | "CREDIT_CARD"
  > = ["COD", "VNPAY", "MOMO", "BANK_TRANSFER", "CREDIT_CARD"];

  return (
    <ContainerComponent style={styles.container} scrollable>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SpaceComponent size={16} />
        <TextComponent type="subheading" style={styles.sectionTitle}>
          Tóm tắt đơn hàng
        </TextComponent>
        <View
          style={[
            globalStyles.card,
            {
              backgroundColor: isDarkMode
                ? Colors.backgroundDark
                : Colors.backgroundLight,
            },
          ]}
        >
          <FlatList
            data={cart?.cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              <RowComponent style={styles.totalRow}>
                <TextComponent type="subheading">Tổng cộng:</TextComponent>
                <TextComponent type="subheading">
                  {cart?.totalPrice.toLocaleString("vi-VN")} VNĐ
                </TextComponent>
              </RowComponent>
            }
          />
        </View>

        <SpaceComponent size={16} />
        <TextComponent type="subheading" style={styles.sectionTitle}>
          Thông tin giao hàng
        </TextComponent>
        <InputComponent
          placeholder="Nhập địa chỉ giao hàng"
          value={shippingAddress}
          onChangeText={setShippingAddress}
          style={styles.input}
          accessibilityLabel="Địa chỉ giao hàng"
        />
        <InputComponent
          placeholder="Ghi chú (nếu có)"
          value={note}
          onChangeText={setNote}
          style={styles.input}
          multiline
          numberOfLines={3}
          accessibilityLabel="Ghi chú đơn hàng"
        />

        <SpaceComponent size={16} />
        <TextComponent type="subheading" style={styles.sectionTitle}>
          Phương thức thanh toán
        </TextComponent>
        <View
          style={[
            globalStyles.card,
            {
              backgroundColor: isDarkMode
                ? Colors.backgroundDark
                : Colors.backgroundLight,
            },
          ]}
        >
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method}
              style={styles.paymentOption}
              onPress={() => setPaymentMethod(method)}
              accessibilityLabel={`Chọn ${method}`}
              accessibilityRole="radio"
              accessibilityState={{ checked: paymentMethod === method }}
            >
              <Ionicons
                name={
                  paymentMethod === method
                    ? "radio-button-on"
                    : "radio-button-off"
                }
                size={20}
                color={isDarkMode ? Colors.textDarkPrimary : Colors.primary}
              />
              <TextComponent type="body" style={styles.paymentText}>
                {method}
              </TextComponent>
            </TouchableOpacity>
          ))}
        </View>

        <SpaceComponent size={24} />
        <ButtonComponent
          title="Xác nhận thanh toán"
          type="primary"
          onPress={handleConfirmOrder}
          style={styles.checkoutButton}
          disabled={status === "loading" || !cart || !user}
          accessibilityLabel="Xác nhận thanh toán"
        />
        <SpaceComponent size={24} />
      </ScrollView>

      <ModalComponent
        visible={showConfirm}
        title="Xác nhận đơn hàng"
        onClose={() => setShowConfirm(false)}
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
          Bạn có chắc muốn đặt đơn hàng với tổng cộng{" "}
          {cart?.totalPrice.toLocaleString("vi-VN")} VNĐ?
        </TextComponent>
        <RowComponent justifyContent="space-between">
          <ButtonComponent
            title="Hủy"
            type="outline"
            onPress={() => setShowConfirm(false)}
            style={styles.modalButton}
            accessibilityLabel="Hủy đặt hàng"
          />
          <ButtonComponent
            title="Xác nhận"
            type="primary"
            onPress={handleCheckout}
            style={styles.modalButton}
            accessibilityLabel="Xác nhận đặt hàng"
          />
        </RowComponent>
      </ModalComponent>

      <ToastComponent
        message={toastMessage}
        type={toastType}
        visible={showToast}
        onHide={() => setShowToast(false)}
        duration={3000}
      />
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: "600",
  },
  cartItem: {
    paddingVertical: 8,
    justifyContent: "space-between",
  },
  cartItemName: {
    flex: 1,
  },
  cartItemPrice: {
    fontWeight: "600",
  },
  totalRow: {
    paddingVertical: 12,
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  input: {
    marginBottom: 12,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  paymentText: {
    marginLeft: 12,
  },
  checkoutButton: {
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 10,
  },
});

export default CheckoutScreen;
