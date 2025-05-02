import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, View, Pressable } from "react-native";
import ContainerComponent from "@/components/common/ContainerComponent";
import TextComponent from "@/components/common/TextComponent";
import InputComponent from "@/components/common/InputComponent";
import ButtonComponent from "@/components/common/ButtonComponent";
import LoadingComponent from "@/components/common/LoadingComponent";
import RowComponent from "@/components/common/RowComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import ModalComponent from "@/components/common/ModalComponent";
import CardComponent from "@/components/common/CardComponent";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store/store";
import { createOrder, resetCart } from "@/store/slices/cartSlice";
import { getAllBranchesApi } from "@/services/api";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

const CheckoutScreen = () => {
  const dispatch = useAppDispatch();
  const { isDarkMode } = useTheme();
  const cart = useSelector((state: RootState) => state.cart.cart);
  const user = useSelector((state: RootState) => state.auth.user);
  const orderStatus = useSelector((state: RootState) => state.cart.status);
  const orderError = useSelector((state: RootState) => state.cart.error);

  const [shippingAddress, setShippingAddress] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "COD" | "VNPAY" | "MOMO" | "BANK_TRANSFER" | "CREDIT_CARD"
  >("COD");
  const [branchId, setBranchId] = useState<number | null>(null);
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [branchModalVisible, setBranchModalVisible] = useState(false);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [branchesError, setBranchesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBranches = async () => {
      setBranchesLoading(true);
      try {
        const response = await getAllBranchesApi();
        if (response.data) {
          setBranches(response.data);
          if (response.data.length > 0) {
            setBranchId(response.data[0].id);
          }
        } else {
          setBranchesError("Không tìm thấy chi nhánh");
          Toast.show({
            type: "error",
            text1: "Không tìm thấy chi nhánh",
            visibilityTime: 3000,
          });
        }
      } catch (error: any) {
        setBranchesError(error.message || "Lỗi khi tải chi nhánh");
        Toast.show({
          type: "error",
          text1: error.message || "Lỗi khi tải chi nhánh",
          visibilityTime: 3000,
        });
      } finally {
        setBranchesLoading(false);
      }
    };
    fetchBranches();
  }, []);

  const handleCheckout = async () => {
    if (!cart || !user || !branchId) {
      Toast.show({
        type: "error",
        text1: "Giỏ hàng, thông tin người dùng hoặc chi nhánh không hợp lệ",
        visibilityTime: 3000,
      });
      return;
    }
    try {
      await dispatch(
        createOrder({
          cartId: cart.id,
          shippingAddress,
          note,
          paymentMethod,
          userId: user.id,
          branchId,
        })
      ).unwrap();
      Toast.show({
        type: "success",
        text1: "Đặt hàng thành công!",
        visibilityTime: 3000,
      });
      dispatch(resetCart());
      router.replace("/(tabs)/home");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.message || "Lỗi khi đặt hàng",
        visibilityTime: 3000,
      });
    }
  };

  useEffect(() => {
    if (orderError) {
      Toast.show({
        type: "error",
        text1: orderError,
        visibilityTime: 3000,
      });
    }
  }, [orderError]);

  const handleSelectBranch = (id: number) => {
    setBranchId(id);
    setBranchModalVisible(false);
  };

  const selectedBranch = branches.find((branch) => branch.id === branchId);

  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return (
      <ContainerComponent style={styles.container}>
        <CardComponent
          style={[
            styles.sectionCard,
            {
              backgroundColor: isDarkMode
                ? Colors.backgroundDark
                : Colors.backgroundLight,
            },
          ]}
        >
          <TextComponent
            type="subheading"
            style={[
              styles.emptyText,
              {
                color: isDarkMode
                  ? Colors.textDarkPrimary
                  : Colors.textLightPrimary,
              },
            ]}
          >
            Giỏ hàng trống. Vui lòng thêm món trước khi thanh toán.
          </TextComponent>
          <ButtonComponent
            title="Quay lại giỏ hàng"
            type="primary"
            onPress={() => router.push("/cart")}
            style={[
              styles.backButton,
              {
                backgroundColor: isDarkMode ? Colors.primary : Colors.accent,
              },
            ]}
            textStyle={{
              color: Colors.white,
              fontWeight: "700",
            }}
          />
        </CardComponent>
      </ContainerComponent>
    );
  }

  return (
    <ContainerComponent
      scrollable
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode
            ? Colors.backgroundDark
            : Colors.backgroundLight,
        },
      ]}
    >
      <SpaceComponent size={20} />
      <CardComponent
        style={[
          styles.sectionCard,
          {
            backgroundColor: isDarkMode
              ? Colors.surfaceDark
              : Colors.surfaceLight,
          },
        ]}
      >
        <TextComponent
          type="subheading"
          style={[
            styles.sectionTitle,
            {
              color: isDarkMode ? Colors.textDarkPrimary : Colors.primary,
            },
          ]}
        >
          Tổng quan đơn hàng
        </TextComponent>
        <TextComponent
          type="body"
          style={[
            styles.summaryText,
            {
              color: isDarkMode
                ? Colors.textDarkSecondary
                : Colors.textLightPrimary,
            },
          ]}
        >
          Tổng cộng: {cart.totalPrice.toLocaleString("vi-VN")} VNĐ (
          {cart.cartItems.length} món)
        </TextComponent>
      </CardComponent>
      <SpaceComponent size={20} />
      <CardComponent
        style={[
          styles.sectionCard,
          {
            backgroundColor: isDarkMode
              ? Colors.surfaceDark
              : Colors.surfaceLight,
          },
        ]}
      >
        <TextComponent
          type="subheading"
          style={[
            styles.sectionTitle,
            {
              color: isDarkMode ? Colors.textDarkPrimary : Colors.primary,
            },
          ]}
        >
          Chi nhánh giao hàng
        </TextComponent>
        <ButtonComponent
          title={selectedBranch ? selectedBranch.name : "Chọn chi nhánh"}
          type="outline"
          onPress={() => setBranchModalVisible(true)}
          style={[
            styles.branchButton,
            {
              borderColor: isDarkMode ? Colors.accent : Colors.primary,
              backgroundColor: isDarkMode ? Colors.crust : Colors.white,
            },
          ]}
          textStyle={{
            color: isDarkMode
              ? Colors.textDarkPrimary
              : Colors.textLightPrimary,
            fontWeight: "600",
          }}
          accessibilityLabel="Chọn chi nhánh giao hàng"
        />
      </CardComponent>
      <SpaceComponent size={20} />
      <CardComponent
        style={[
          styles.sectionCard,
          {
            backgroundColor: isDarkMode
              ? Colors.surfaceDark
              : Colors.surfaceLight,
          },
        ]}
      >
        <TextComponent
          type="subheading"
          style={[
            styles.sectionTitle,
            {
              color: isDarkMode ? Colors.textDarkPrimary : Colors.primary,
            },
          ]}
        >
          Thông tin giao hàng
        </TextComponent>
        <InputComponent
          placeholder="Địa chỉ giao hàng"
          value={shippingAddress}
          onChangeText={setShippingAddress}
          style={[
            styles.input,
            {
              borderColor: isDarkMode ? Colors.accent : Colors.primary,
              backgroundColor: isDarkMode ? Colors.crust : Colors.white,
            },
          ]}
          placeholderTextColor={
            isDarkMode ? Colors.textDarkSecondary : Colors.textLightSecondary
          }
          accessibilityLabel="Nhập địa chỉ giao hàng"
        />
        <InputComponent
          placeholder="Ghi chú (tùy chọn)"
          value={note}
          onChangeText={setNote}
          style={[
            styles.input,
            {
              borderColor: isDarkMode ? Colors.accent : Colors.primary,
              backgroundColor: isDarkMode ? Colors.crust : Colors.white,
            },
          ]}
          multiline
          numberOfLines={3}
          placeholderTextColor={
            isDarkMode ? Colors.textDarkSecondary : Colors.textLightSecondary
          }
          accessibilityLabel="Nhập ghi chú cho đơn hàng"
        />
      </CardComponent>
      <SpaceComponent size={20} />
      <CardComponent
        style={[
          styles.sectionCard,
          {
            backgroundColor: isDarkMode
              ? Colors.surfaceDark
              : Colors.surfaceLight,
          },
        ]}
      >
        <TextComponent
          type="subheading"
          style={[
            styles.sectionTitle,
            {
              color: isDarkMode ? Colors.textDarkPrimary : Colors.primary,
            },
          ]}
        >
          Phương thức thanh toán
        </TextComponent>
        <RowComponent style={styles.paymentMethods}>
          {["COD", "VNPAY", "MOMO", "BANK_TRANSFER", "CREDIT_CARD"].map(
            (method) => (
              <Pressable
                key={method}
                onPress={() => setPaymentMethod(method as any)}
                style={({ pressed }) => [
                  styles.paymentButton,
                  {
                    borderColor:
                      paymentMethod === method
                        ? Colors.accent
                        : isDarkMode
                        ? Colors.primary
                        : Colors.borderLight,
                    backgroundColor:
                      paymentMethod === method
                        ? isDarkMode
                          ? Colors.primary
                          : Colors.accent
                        : isDarkMode
                        ? Colors.crust
                        : Colors.white,
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                  },
                ]}
              >
                <TextComponent
                  type="body"
                  style={{
                    color:
                      paymentMethod === method
                        ? Colors.white
                        : isDarkMode
                        ? Colors.textDarkPrimary
                        : Colors.textLightPrimary,
                    fontWeight: paymentMethod === method ? "700" : "500",
                  }}
                >
                  {method}
                </TextComponent>
              </Pressable>
            )
          )}
        </RowComponent>
      </CardComponent>
      <SpaceComponent size={20} />
      <Pressable
        onPress={handleCheckout}
        disabled={orderStatus === "loading" || !shippingAddress || !branchId}
        style={({ pressed }) => [
          styles.confirmButton,
          {
            backgroundColor: isDarkMode ? Colors.primary : Colors.accent,
            opacity:
              orderStatus === "loading" || !shippingAddress || !branchId
                ? 0.6
                : pressed
                ? 0.8
                : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
        accessibilityLabel="Xác nhận đặt hàng"
      >
        <TextComponent
          type="subheading"
          style={{
            color: Colors.white,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          Xác nhận đặt hàng
        </TextComponent>
      </Pressable>
      {orderStatus === "loading" || branchesLoading ? (
        <LoadingComponent
          loadingText="Đang xử lý..."
          textStyle={{
            color: isDarkMode ? Colors.textDarkPrimary : Colors.primary,
          }}
        />
      ) : null}
      <ModalComponent
        visible={branchModalVisible}
        title="Chọn chi nhánh"
        onClose={() => setBranchModalVisible(false)}
        titleStyle={{
          color: isDarkMode ? Colors.textDarkPrimary : Colors.primary,
          fontSize: 20,
          fontWeight: "700",
        }}
      >
        {branchesError ? (
          <TextComponent
            type="body"
            style={[styles.errorText, { color: Colors.error }]}
          >
            {branchesError}
          </TextComponent>
        ) : branches.length === 0 ? (
          <TextComponent
            type="body"
            style={[styles.errorText, { color: Colors.error }]}
          >
            Không có chi nhánh nào khả dụng
          </TextComponent>
        ) : (
          <ScrollView
            style={styles.branchScrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.branchScrollContent}
          >
            {branches.map((item) => (
              <Pressable
                key={item.id.toString()}
                onPress={() => handleSelectBranch(item.id)}
                style={({ pressed }) => [
                  styles.branchOptionContainer,
                  {
                    backgroundColor:
                      branchId === item.id
                        ? isDarkMode
                          ? Colors.primary
                          : Colors.accent
                        : isDarkMode
                        ? Colors.crust
                        : Colors.white,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                ]}
              >
                <TextComponent
                  type="body"
                  style={{
                    color:
                      branchId === item.id
                        ? Colors.white
                        : isDarkMode
                        ? Colors.textDarkPrimary
                        : Colors.textLightPrimary,
                    fontWeight: branchId === item.id ? "700" : "500",
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                  }}
                >
                  {item.name}
                </TextComponent>
                {item.address && (
                  <TextComponent
                    type="caption"
                    style={[
                      styles.branchDetail,
                      {
                        color: isDarkMode
                          ? Colors.textDarkSecondary
                          : Colors.textLightSecondary,
                      },
                    ]}
                  >
                    {item.address}
                  </TextComponent>
                )}
                {item.phone && (
                  <TextComponent
                    type="caption"
                    style={[
                      styles.branchDetail,
                      {
                        color: isDarkMode
                          ? Colors.textDarkSecondary
                          : Colors.textLightSecondary,
                      },
                    ]}
                  >
                    {item.phone}
                  </TextComponent>
                )}
              </Pressable>
            ))}
            <SpaceComponent size={20} />
          </ScrollView>
        )}
        <ButtonComponent
          title="Đóng"
          type="outline"
          onPress={() => setBranchModalVisible(false)}
          style={[
            styles.closeButton,
            {
              borderColor: isDarkMode ? Colors.accent : Colors.primary,
              backgroundColor: isDarkMode ? Colors.crust : Colors.white,
            },
          ]}
          textStyle={{
            color: isDarkMode ? Colors.textDarkPrimary : Colors.primary,
            fontWeight: "600",
          }}
          accessibilityLabel="Đóng danh sách chi nhánh"
        />
      </ModalComponent>
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionCard: {
    padding: 20,
    borderRadius: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "500",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 18,
    marginVertical: 20,
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 20,
  },
  backButton: {
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  input: {
    marginBottom: 16,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1.5,
    fontSize: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  branchButton: {
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentMethods: {
    flexWrap: "wrap",
    gap: 12,
  },
  paymentButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1.5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  confirmButton: {
    paddingVertical: 18,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  branchScrollView: {
    maxHeight: 320,
  },
  branchScrollContent: {
    paddingVertical: 8,
  },
  branchOptionContainer: {
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  branchDetail: {
    marginBottom: 8,
    marginLeft: 16,
    marginRight: 16,
  },
  closeButton: {
    paddingVertical: 16,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});

export default CheckoutScreen;
