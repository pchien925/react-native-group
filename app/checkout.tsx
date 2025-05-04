import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
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
  const cart = useSelector(
    (state: RootState) => state.cart.cart
  ) as ICart | null;
  const user = useSelector(
    (state: RootState) => state.auth.user
  ) as IUser | null;

  const [shippingAddress, setShippingAddress] = useState("");
  const [addressOption, setAddressOption] = useState<
    "NEW" | "STORE" | "DEFAULT"
  >("NEW");
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
  const [addressError, setAddressError] = useState<string | null>(null);

  const selectedBranch: IBranch | undefined = branches.find(
    (branch) => branch.id === branchId
  );

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
    if (addressOption === "STORE" && selectedBranch?.address) {
      setShippingAddress(selectedBranch.address);
      setAddressError(null);
    } else if (addressOption === "DEFAULT" && user?.address) {
      setShippingAddress(user.address);
      setAddressError(null);
    } else {
      setShippingAddress("");
      setAddressError(null);
    }
  }, [addressOption, user?.address, selectedBranch]);

  const handleCheckout = async () => {
    if (!cart || !user || !branchId || !shippingAddress) {
      if (!shippingAddress) {
        setAddressError("Vui lòng nhập hoặc chọn địa chỉ giao hàng");
      }
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

  const selectAddressOption = (option: "NEW" | "STORE" | "DEFAULT") => {
    if (option === "STORE" && !selectedBranch) {
      Toast.show({ type: "error", text1: "Vui lòng chọn chi nhánh trước" });
      return;
    }
    setAddressOption(option);
  };

  const renderCartItem = (item: ICartItem) => {
    const optionPrice = item.selectedOptions.reduce(
      (sum, opt) => sum + opt.additionalPrice,
      0
    );
    const totalPrice = (item.priceAtAddition + optionPrice) * item.quantity;

    return (
      <RowComponent key={item.id.toString()} style={styles.cartItem}>
        <TextComponent
          type="body"
          style={{
            color: isDarkMode
              ? Colors.textDarkPrimary
              : Colors.textLightPrimary,
            flex: 1,
            paddingRight: 8,
          }}
        >
          {item.menuItem.name} x{item.quantity}
          {item.selectedOptions.length > 0 && (
            <TextComponent
              type="caption"
              style={{
                color: isDarkMode
                  ? Colors.textDarkSecondary
                  : Colors.textLightSecondary,
                marginTop: 4,
              }}
            >
              ({item.selectedOptions.map((opt) => opt.value).join(", ")})
            </TextComponent>
          )}
        </TextComponent>
        <TextComponent
          type="body"
          style={{
            color: isDarkMode
              ? Colors.textDarkPrimary
              : Colors.textLightPrimary,
          }}
        >
          {totalPrice.toLocaleString("vi-VN")} VNĐ
        </TextComponent>
      </RowComponent>
    );
  };

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
      scrollable={true}
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
        <View style={styles.cartList}>
          {cart.cartItems.map((item) => renderCartItem(item))}
        </View>
        <TextComponent
          type="body"
          style={[
            styles.summaryText,
            {
              color: isDarkMode
                ? Colors.textDarkPrimary
                : Colors.textLightPrimary,
            },
          ]}
        >
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
        <TextComponent
          type="body"
          style={{
            color: isDarkMode
              ? Colors.textDarkSecondary
              : Colors.textLightSecondary,
            marginBottom: 12,
          }}
        >
          Chọn phương thức nhận hàng
        </TextComponent>
        <Pressable
          onPress={() => selectAddressOption("NEW")}
          style={({ pressed }) => [
            styles.defaultAddressContainer,
            {
              backgroundColor:
                addressOption === "NEW"
                  ? isDarkMode
                    ? Colors.backgroundDark
                    : Colors.backgroundLight
                  : "transparent",
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Ionicons
            name={
              addressOption === "NEW" ? "radio-button-on" : "radio-button-off"
            }
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
            Nhập địa chỉ mới
          </TextComponent>
        </Pressable>
        <Pressable
          onPress={() => selectAddressOption("STORE")}
          style={({ pressed }) => [
            styles.defaultAddressContainer,
            {
              backgroundColor:
                addressOption === "STORE"
                  ? isDarkMode
                    ? Colors.backgroundDark
                    : Colors.backgroundLight
                  : "transparent",
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Ionicons
            name={
              addressOption === "STORE" ? "radio-button-on" : "radio-button-off"
            }
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
            Nhận tại cửa hàng
          </TextComponent>
        </Pressable>
        {addressOption === "STORE" && selectedBranch?.address && (
          <TextComponent
            type="caption"
            style={{
              color: isDarkMode
                ? Colors.textDarkSecondary
                : Colors.textLightSecondary,
              marginLeft: 28,
              marginBottom: 16,
            }}
          >
            Địa chỉ: {selectedBranch.address}
          </TextComponent>
        )}
        {user?.address && (
          <Pressable
            onPress={() => selectAddressOption("DEFAULT")}
            style={({ pressed }) => [
              styles.defaultAddressContainer,
              {
                backgroundColor:
                  addressOption === "DEFAULT"
                    ? isDarkMode
                      ? Colors.backgroundDark
                      : Colors.backgroundLight
                    : "transparent",
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons
              name={
                addressOption === "DEFAULT"
                  ? "radio-button-on"
                  : "radio-button-off"
              }
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
        <View
          style={[
            styles.inputContainer,
            { opacity: addressOption === "NEW" ? 1 : 0.5 },
          ]}
        >
          <Ionicons
            name="location-outline"
            size={24}
            color={
              isDarkMode ? Colors.textDarkSecondary : Colors.textLightSecondary
            }
            style={styles.inputIcon}
          />
          <InputComponent
            placeholder="Địa chỉ giao hàng"
            value={shippingAddress}
            onChangeText={setShippingAddress}
            style={[
              styles.input,
              {
                borderColor: Colors.secondary,
                backgroundColor: Colors.backgroundLight,
                paddingLeft: 40,
              },
            ]}
            placeholderTextColor={
              isDarkMode ? Colors.textDarkSecondary : Colors.textLightSecondary
            }
            accessibilityLabel="Nhập địa chỉ giao hàng"
            editable={addressOption === "NEW"}
          />
        </View>
        {addressError && (
          <TextComponent
            type="caption"
            style={{ color: Colors.error, marginBottom: 12 }}
          >
            {addressError}
          </TextComponent>
        )}
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
        <RowComponent style={[styles.paymentMethods, { flexWrap: "wrap" }]}>
          {[
            {
              method: "COD",
              icon: "cash-outline",
              label: "Thanh toán khi nhận hàng",
            },
            { method: "VNPAY", icon: "card-outline", label: "VNPAY" },
            { method: "MOMO", icon: "wallet-outline", label: "MOMO" },
            {
              method: "BANK_TRANSFER",
              icon: "business-outline",
              label: "Chuyển khoản ngân hàng",
            },
            {
              method: "CREDIT_CARD",
              icon: "card-outline",
              label: "Thẻ tín dụng",
            },
          ].map(({ method, icon, label }) => (
            <Pressable
              key={method}
              onPress={() => setPaymentMethod(method as any)}
              style={({ pressed }) => [
                styles.paymentCard,
                {
                  borderColor:
                    paymentMethod === method ? Colors.accent : Colors.secondary,
                  backgroundColor:
                    paymentMethod === method
                      ? isDarkMode
                        ? Colors.backgroundDark
                        : Colors.backgroundLight
                      : Colors.backgroundLight,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Ionicons
                name={icon as any}
                size={24}
                color={
                  paymentMethod === method
                    ? Colors.primary
                    : isDarkMode
                    ? Colors.textDarkSecondary
                    : Colors.textLightSecondary
                }
                style={styles.paymentIcon}
              />
              <TextComponent
                type="body"
                style={{
                  color:
                    paymentMethod === method
                      ? Colors.primary
                      : isDarkMode
                      ? Colors.textDarkPrimary
                      : Colors.textLightPrimary,
                  fontWeight: paymentMethod === method ? "600" : "500",
                }}
              >
                {label}
              </TextComponent>
            </Pressable>
          ))}
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
    marginTop: 12,
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
    marginBottom: 16,
    gap: 8,
    padding: 8,
    borderRadius: 8,
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
  inputContainer: {
    position: "relative",
    marginBottom: 12,
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    fontSize: 14,
    backgroundColor: Colors.backgroundLight,
  },
  inputIcon: {
    position: "absolute",
    left: 10,
    top: 16,
    zIndex: 1,
  },
  branchButton: {
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: Colors.backgroundLight,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  paymentMethods: {
    gap: 12,
  },
  paymentCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    width: "48%",
    marginBottom: 12,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paymentIcon: {
    marginRight: 8,
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
  cartList: {
    maxHeight: 150,
    overflow: "hidden",
  },
  cartItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.secondary,
  },
});

export default CheckoutScreen;
