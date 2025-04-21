// screens/CheckoutScreen.tsx
import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import ContainerComponent from "@/components/common/ContainerComponent";
import TextComponent from "@/components/common/TextComponent";
import InputComponent from "@/components/common/InputComponent";
import ButtonComponent from "@/components/common/ButtonComponent";
import LoadingComponent from "@/components/common/LoadingComponent";
import ToastComponent from "@/components/common/ToastComponent";
import RowComponent from "@/components/common/RowComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import ModalComponent from "@/components/common/ModalComponent";
import CardComponent from "@/components/common/CardComponent";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/global.styles";
import { useTheme } from "@/contexts/ThemeContext";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store/store";
import { createOrder, resetCart } from "@/store/slices/cartSlice";
import { getAllBranchesApi } from "@/services/api";
import { router } from "expo-router";

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
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "warning" | "error" | "info" | "default";
    visible: boolean;
  }>({
    message: "",
    type: "default",
    visible: false,
  });

  const showToast = (
    message: string,
    type: "success" | "warning" | "error" | "info" | "default"
  ) => {
    setToast({ message, type, visible: true });
  };

  const hideToast = () => {
    setToast({ ...toast, visible: false });
  };

  // Lấy danh sách chi nhánh
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
          showToast("Không tìm thấy chi nhánh", "error");
        }
      } catch (error: any) {
        setBranchesError(error.message || "Lỗi khi tải chi nhánh");
        showToast(error.message || "Lỗi khi tải chi nhánh", "error");
      } finally {
        setBranchesLoading(false);
      }
    };
    fetchBranches();
  }, []);

  const handleCheckout = async () => {
    if (!cart || !user || !branchId) {
      showToast(
        "Giỏ hàng, thông tin người dùng hoặc chi nhánh không hợp lệ",
        "error"
      );
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
      showToast("Đặt hàng thành công!", "success");
      dispatch(resetCart());
      router.replace("home");
    } catch (error: any) {
      showToast(error.message || "Lỗi khi đặt hàng", "error");
    }
  };

  useEffect(() => {
    if (orderError) {
      showToast(orderError, "error");
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
            onPress={() => router.push("/(tabs)/cart")}
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
      <SpaceComponent size={16} />
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
            styles.sectionTitle,
            {
              color: isDarkMode ? Colors.textDarkPrimary : Colors.primary,
            },
          ]}
        >
          Thông tin thanh toán
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
      <SpaceComponent size={16} />
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
              borderColor: isDarkMode ? Colors.primary : Colors.accent,
              backgroundColor: isDarkMode ? Colors.crust : Colors.white,
              shadowColor: Colors.black,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
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
      <SpaceComponent size={16} />
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
              borderColor: isDarkMode ? Colors.primary : Colors.accent,
              backgroundColor: isDarkMode ? Colors.crust : Colors.white,
              shadowColor: Colors.black,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
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
              borderColor: isDarkMode ? Colors.primary : Colors.accent,
              backgroundColor: isDarkMode ? Colors.crust : Colors.white,
              shadowColor: Colors.black,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
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
      <SpaceComponent size={16} />
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
              <ButtonComponent
                key={method}
                title={method}
                type={paymentMethod === method ? "primary" : "outline"}
                onPress={() => setPaymentMethod(method as any)}
                style={[
                  styles.paymentButton,
                  {
                    borderColor:
                      paymentMethod === method
                        ? Colors.primary
                        : isDarkMode
                        ? Colors.primary
                        : Colors.accent,
                    backgroundColor:
                      paymentMethod === method
                        ? Colors.primary
                        : isDarkMode
                        ? Colors.crust
                        : Colors.white,
                    shadowColor: Colors.black,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 3,
                  },
                ]}
                textStyle={{
                  color:
                    paymentMethod === method
                      ? Colors.white
                      : isDarkMode
                      ? Colors.textDarkPrimary
                      : Colors.textLightPrimary,
                  fontWeight: paymentMethod === method ? "700" : "500",
                }}
                accessibilityLabel={`Chọn phương thức ${method}`}
              />
            )
          )}
        </RowComponent>
      </CardComponent>
      <SpaceComponent size={16} />
      <ButtonComponent
        title="Xác nhận đặt hàng"
        type="primary"
        onPress={handleCheckout}
        disabled={orderStatus === "loading" || !shippingAddress || !branchId}
        style={[
          styles.confirmButton,
          {
            backgroundColor: isDarkMode ? Colors.primary : Colors.accent,
            shadowColor: Colors.black,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
            elevation: 5,
          },
        ]}
        textStyle={{
          color: Colors.white,
          fontWeight: "700",
        }}
        accessibilityLabel="Xác nhận đặt hàng"
      />
      {orderStatus === "loading" || branchesLoading ? (
        <LoadingComponent
          loadingText="Đang xử lý..."
          textStyle={{
            color: isDarkMode ? Colors.textDarkPrimary : Colors.primary,
          }}
        />
      ) : null}
      <ToastComponent
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
        duration={3000}
      />
      <ModalComponent
        visible={branchModalVisible}
        title="Chọn chi nhánh"
        onClose={() => setBranchModalVisible(false)}
        titleStyle={{
          color: isDarkMode ? Colors.textDarkPrimary : Colors.primary,
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
              <View
                key={item.id.toString()}
                style={styles.branchOptionContainer}
              >
                <ButtonComponent
                  title={item.name}
                  type={branchId === item.id ? "primary" : "outline"}
                  onPress={() => handleSelectBranch(item.id)}
                  style={[
                    styles.branchOption,
                    {
                      borderColor:
                        branchId === item.id
                          ? Colors.primary
                          : isDarkMode
                          ? Colors.primary
                          : Colors.accent,
                      backgroundColor:
                        branchId === item.id
                          ? Colors.primary
                          : isDarkMode
                          ? Colors.crust
                          : Colors.white,
                      shadowColor: Colors.black,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.2,
                      shadowRadius: 4,
                      elevation: 3,
                    },
                  ]}
                  textStyle={{
                    color:
                      branchId === item.id
                        ? Colors.white
                        : isDarkMode
                        ? Colors.textDarkPrimary
                        : Colors.textLightPrimary,
                    fontWeight: branchId === item.id ? "700" : "500",
                  }}
                  accessibilityLabel={`Chọn chi nhánh ${item.name}`}
                />
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
              </View>
            ))}
            <SpaceComponent size={16} />
          </ScrollView>
        )}
        <ButtonComponent
          title="Đóng"
          type="outline"
          onPress={() => setBranchModalVisible(false)}
          style={[
            styles.closeButton,
            {
              borderColor: isDarkMode ? Colors.primary : Colors.accent,
              backgroundColor: isDarkMode ? Colors.crust : Colors.white,
              shadowColor: Colors.black,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 3,
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
    paddingHorizontal: 16,
  },
  sectionCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "500",
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 16,
  },
  errorText: {
    textAlign: "center",
    marginVertical: 16,
  },
  backButton: {
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  input: {
    marginBottom: 12,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
  },
  branchButton: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  paymentMethods: {
    flexWrap: "wrap",
    gap: 10,
  },
  paymentButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  confirmButton: {
    paddingVertical: 16,
    borderRadius: 12,
  },
  branchScrollView: {
    maxHeight: 300,
  },
  branchScrollContent: {
    paddingBottom: 16,
  },
  branchOptionContainer: {
    marginVertical: 4,
  },
  branchOption: {
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  branchDetail: {
    marginTop: 4,
    marginLeft: 16,
  },
  closeButton: {
    paddingVertical: 14,
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
});

export default CheckoutScreen;
