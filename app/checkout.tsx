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
import { createOrderApi, getAllBranchesApi } from "@/services/api";
import { resetCart } from "@/store/slices/cartSlice";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

const CheckoutScreen = () => {
  const dispatch = useAppDispatch();
  const { isDarkMode } = useTheme();
  const cart = useSelector((state: RootState) => state.cart.cart);
  const user = useSelector((state: RootState) => state.auth.user);

  const [shippingAddress, setShippingAddress] = useState("");
  const [useDefaultAddress, setUseDefaultAddress] = useState(false);
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "COD" | "VNPAY" | "MOMO" | "BANK_TRANSFER" | "CREDIT_CARD"
  >("COD");
  const [branchId, setBranchId] = useState<number | null>(null);
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [branchModalVisible, setBranchModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
          setError("Không tìm thấy chi nhánh");
          Toast.show({ type: "error", text1: "Không tìm thấy chi nhánh" });
        }
      } catch (error: any) {
        setError(error.message || "Lỗi khi tải chi nhánh");
        Toast.show({
          type: "error",
          text1: error.message || "Lỗi khi tải chi nhánh",
        });
      } finally {
        setBranchesLoading(false);
      }
    };
    fetchBranches();
  }, []);

  useEffect(() => {
    if (useDefaultAddress && user?.address) {
      setShippingAddress(user.address);
    } else if (!useDefaultAddress) {
      setShippingAddress("");
    }
  }, [useDefaultAddress, user?.address]);

  const handleCheckout = async () => {
    if (!cart || !user || !branchId || !shippingAddress) {
      Toast.show({ type: "error", text1: "Vui lòng nhập đầy đủ thông tin" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await createOrderApi(
        user.id,
        branchId,
        shippingAddress,
        note,
        paymentMethod
      );
      if (response.data) {
        Toast.show({ type: "success", text1: "Đặt hàng thành công!" });
        dispatch(resetCart());
        router.replace("/(tabs)/home");
      } else {
        throw new Error("Không thể tạo đơn hàng");
      }
    } catch (error: any) {
      setError(error.message || "Lỗi khi đặt hàng");
      Toast.show({ type: "error", text1: error.message || "Lỗi khi đặt hàng" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectBranch = (id: number) => {
    setBranchId(id);
    setBranchModalVisible(false);
  };

  const toggleDefaultAddress = () => {
    setUseDefaultAddress(!useDefaultAddress);
  };

  const selectedBranch = branches.find((branch) => branch.id === branchId);

  if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
    return (
      <ContainerComponent style={styles.container}>
        <CardComponent style={isDarkMode ? styles.cardDark : styles.cardLight}>
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
            style={styles.backButton}
            textStyle={{ color: Colors.backgroundLight, fontWeight: "600" }}
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
      <CardComponent style={isDarkMode ? styles.cardDark : styles.cardLight}>
        <TextComponent
          type="subheading"
          style={[
            styles.sectionTitle,
            {
              color: isDarkMode
                ? Colors.textDarkPrimary
                : Colors.textLightPrimary,
            },
          ]}
        >
          Tổng quan đơn hàng
        </TextComponent>
        <TextComponent type="body" style={[styles.summaryText]}>
          Tổng cộng: {cart.totalPrice.toLocaleString("vi-VN")} VNĐ (
          {cart.cartItems.length} món)
        </TextComponent>
      </CardComponent>
      <SpaceComponent size={16} />
      <CardComponent style={isDarkMode ? styles.cardDark : styles.cardLight}>
        <TextComponent
          type="subheading"
          style={[
            styles.sectionTitle,
            {
              color: isDarkMode
                ? Colors.textDarkPrimary
                : Colors.textLightPrimary,
            },
          ]}
        >
          Chi nhánh giao hàng
        </TextComponent>
        <ButtonComponent
          title={selectedBranch ? selectedBranch.name : "Chọn chi nhánh"}
          type="outline"
          onPress={() => setBranchModalVisible(true)}
          style={[styles.branchButton, { borderColor: Colors.secondary }]}
          textStyle={{
            color: isDarkMode
              ? Colors.textDarkPrimary
              : Colors.textLightPrimary,
            fontWeight: "500",
          }}
          accessibilityLabel="Chọn chi nhánh giao hàng"
        />
      </CardComponent>
      <SpaceComponent size={16} />
      <CardComponent style={isDarkMode ? styles.cardDark : styles.cardLight}>
        <TextComponent
          type="subheading"
          style={[
            styles.sectionTitle,
            {
              color: isDarkMode
                ? Colors.textDarkPrimary
                : Colors.textLightPrimary,
            },
          ]}
        >
          Thông tin giao hàng
        </TextComponent>
        {user?.address && (
          <Pressable
            onPress={toggleDefaultAddress}
            style={styles.defaultAddressContainer}
          >
            <Ionicons
              name={useDefaultAddress ? "checkbox" : "square-outline"}
              size={20}
              color={Colors.accent}
            />
            <TextComponent
              type="body"
              style={[
                styles.defaultAddressText,
                {
                  color: isDarkMode
                    ? Colors.textDarkPrimary
                    : Colors.textLightPrimary,
                },
              ]}
            >
              Sử dụng địa chỉ mặc định: {user.address}
            </TextComponent>
          </Pressable>
        )}
        <InputComponent
          placeholder="Địa chỉ giao hàng"
          value={shippingAddress}
          onChangeText={setShippingAddress}
          style={[
            styles.input,
            {
              borderColor: Colors.secondary,
              backgroundColor: Colors.backgroundLight,
            },
          ]}
          placeholderTextColor={
            isDarkMode ? Colors.textDarkSecondary : Colors.textLightSecondary
          }
          accessibilityLabel="Nhập địa chỉ giao hàng"
          editable={!useDefaultAddress}
        />
        <InputComponent
          placeholder="Ghi chú (tùy chọn)"
          value={note}
          onChangeText={setNote}
          style={[
            styles.input,
            {
              borderColor: Colors.secondary,
              backgroundColor: Colors.backgroundLight,
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
      <CardComponent style={isDarkMode ? styles.cardDark : styles.cardLight}>
        <TextComponent
          type="subheading"
          style={[
            styles.sectionTitle,
            {
              color: isDarkMode
                ? Colors.textDarkPrimary
                : Colors.textLightPrimary,
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
                        : Colors.secondary,
                    backgroundColor:
                      paymentMethod === method
                        ? Colors.accent
                        : Colors.backgroundLight,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <TextComponent
                  type="body"
                  style={{
                    color:
                      paymentMethod === method
                        ? Colors.backgroundLight
                        : isDarkMode
                        ? Colors.textDarkPrimary
                        : Colors.textLightPrimary,
                    fontWeight: paymentMethod === method ? "600" : "500",
                  }}
                >
                  {method}
                </TextComponent>
              </Pressable>
            )
          )}
        </RowComponent>
      </CardComponent>
      <SpaceComponent size={16} />
      <Pressable
        onPress={handleCheckout}
        disabled={isLoading || !shippingAddress || !branchId}
        style={[
          styles.confirmButton,
          {
            backgroundColor:
              isLoading || !shippingAddress || !branchId
                ? Colors.disabled
                : Colors.primary,
          },
        ]}
        accessibilityLabel="Xác nhận đặt hàng"
      >
        <TextComponent
          type="subheading"
          style={{
            color: Colors.backgroundLight,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          Xác nhận đặt hàng
        </TextComponent>
      </Pressable>
      <SpaceComponent size={16} />
      {isLoading || branchesLoading ? (
        <LoadingComponent
          loadingText="Đang xử lý..."
          textStyle={{ color: Colors.primary }}
        />
      ) : null}
      <ModalComponent
        visible={branchModalVisible}
        title="Chọn chi nhánh"
        onClose={() => setBranchModalVisible(false)}
        style={isDarkMode ? styles.modalDark : styles.modalLight}
        titleStyle={{
          color: isDarkMode ? Colors.textDarkPrimary : Colors.textLightPrimary,
          fontSize: 20,
          fontWeight: "700",
        }}
      >
        {error ? (
          <TextComponent
            type="body"
            style={[styles.errorText, { color: Colors.error }]}
          >
            {error}
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
                        ? Colors.accent
                        : Colors.backgroundLight,
                    elevation: branchId === item.id ? 6 : 3,
                    shadowColor: Colors.black,
                    shadowOffset: {
                      width: 0,
                      height: branchId === item.id ? 4 : 2,
                    },
                    shadowOpacity: branchId === item.id ? 0.25 : 0.15,
                    shadowRadius: branchId === item.id ? 6 : 4,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <TextComponent
                  type="body"
                  style={{
                    color:
                      branchId === item.id
                        ? Colors.backgroundLight
                        : isDarkMode
                        ? Colors.textDarkPrimary
                        : Colors.textLightPrimary,
                    fontWeight: branchId === item.id ? "700" : "500",
                    fontSize: 16,
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
              borderColor: Colors.secondary,
              backgroundColor: isDarkMode
                ? Colors.surfaceDark
                : Colors.backgroundLight,
            },
          ]}
          textStyle={{
            color: isDarkMode
              ? Colors.textDarkPrimary
              : Colors.textLightPrimary,
            fontWeight: "600",
            fontSize: 16,
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
    paddingBottom: 16,
  },
  cardLight: {
    backgroundColor: Colors.backgroundLight,
    padding: 16,
    borderRadius: 12,
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  cardDark: {
    backgroundColor: Colors.surfaceDark,
    padding: 16,
    borderRadius: 12,
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  modalLight: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 16,
    elevation: 6,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalDark: {
    backgroundColor: Colors.surfaceDark,
    borderRadius: 16,
    elevation: 6,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    marginVertical: 16,
  },
  errorText: {
    textAlign: "center",
    fontSize: 14,
    marginVertical: 16,
  },
  defaultAddressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  defaultAddressText: {
    fontSize: 14,
    fontWeight: "500",
  },
  backButton: {
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    elevation: 3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  input: {
    marginBottom: 12,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    fontSize: 14,
    backgroundColor: Colors.backgroundLight,
  },
  branchButton: {
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: Colors.backgroundLight,
  },
  paymentMethods: {
    flexWrap: "wrap",
    gap: 8,
  },
  paymentButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: Colors.backgroundLight,
  },
  confirmButton: {
    paddingVertical: 14,
    borderRadius: 8,
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  branchScrollView: {
    maxHeight: 300,
  },
  branchScrollContent: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  branchOptionContainer: {
    marginVertical: 6,
    borderRadius: 10,
    padding: 8,
  },
  branchDetail: {
    marginBottom: 8,
    marginHorizontal: 16,
    fontSize: 12,
  },
  closeButton: {
    paddingVertical: 12,
    marginTop: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
});

export default CheckoutScreen;
