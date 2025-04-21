// screens/OrderDetailScreen.tsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { ScrollView, StyleSheet, Linking, Alert, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import ContainerComponent from "@/components/common/ContainerComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import TextComponent from "@/components/common/TextComponent";
import ButtonComponent from "@/components/common/ButtonComponent";
import CardComponent from "@/components/common/CardComponent";
import RowComponent from "@/components/common/RowComponent";
import TagComponent from "@/components/common/TagComponent";
import ImageComponent from "@/components/common/ImageComponent";
import ToastComponent from "@/components/common/ToastComponent";
import LoadingComponent from "@/components/common/LoadingComponent";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { getOrderByIdApi, cancelOrderApi } from "@/services/api";

const OrderDetailScreen = () => {
  const { isDarkMode } = useTheme();
  const { id, userId } = useLocalSearchParams();
  const [orderDetail, setOrderDetail] = useState<IOrderDetail | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "succeeded" | "failed"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    visible: boolean;
  }>({
    message: "",
    type: "success",
    visible: false,
  });

  // Lấy chi tiết đơn hàng từ API
  useEffect(() => {
    if (status === "idle" && id && userId) {
      setStatus("loading");
      const fetchOrder = async () => {
        try {
          const response = await getOrderByIdApi(Number(id), Number(userId));
          console.log("Order response:", response);
          if (response.error || !response.data) {
            throw new Error(response.message || "Failed to fetch order");
          }
          setOrderDetail(response.data);
          setStatus("succeeded");
        } catch (error: any) {
          setError(error.message || "Lỗi tải chi tiết đơn hàng");
          setStatus("failed");
          setToast({
            message: error.message || "Lỗi tải chi tiết đơn hàng",
            type: "error",
            visible: true,
          });
        }
      };
      fetchOrder();
    }
  }, [status, id, userId]);

  // Xử lý hủy đơn hàng
  const handleCancelOrder = useCallback(async () => {
    if (!id || !userId || !orderDetail) return;
    try {
      const response = await cancelOrderApi(Number(id), Number(userId));
      if (response.error || !response.data) {
        throw new Error(response.message || "Failed to cancel order");
      }
      setOrderDetail(response.data);
      setToast({
        message: "Đơn hàng đã được hủy thành công!",
        type: "success",
        visible: true,
      });
    } catch (error: any) {
      setToast({
        message: error.message || "Không thể hủy đơn hàng",
        type: "error",
        visible: true,
      });
    }
  }, [id, userId, orderDetail]);

  // Modal xác nhận hủy đơn
  const confirmCancelOrder = useCallback(() => {
    Alert.alert(
      "Xác nhận hủy đơn",
      "Bạn có chắc muốn hủy đơn hàng này?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Xác nhận", onPress: handleCancelOrder },
      ],
      { cancelable: true }
    );
  }, [handleCancelOrder]);

  const getStatusTagType = useCallback(
    (status: string): "success" | "warning" | "error" | "info" => {
      switch (status) {
        case "COMPLETED":
          return "success";
        case "SHIPPING":
        case "PROCESSING":
          return "warning";
        case "CANCELED":
          return "error";
        default:
          return "info";
      }
    },
    []
  );

  const renderOrderItem = useCallback(
    (item: IOrderItem, index: number) => (
      <CardComponent
        key={item.id}
        style={[
          styles.orderItemCard,
          {
            backgroundColor: isDarkMode ? Colors.crust : Colors.garlicCream,
            borderColor: isDarkMode ? Colors.borderDark : Colors.mushroom,
          },
        ]}
      >
        <RowComponent alignItems="flex-start">
          <ImageComponent
            source={{ uri: item.item.imageUrl }}
            style={styles.itemImage}
          />
          <View style={styles.itemDetails}>
            <TextComponent
              type="subheading"
              style={[
                styles.itemName,
                {
                  color: isDarkMode
                    ? Colors.textDarkPrimary
                    : Colors.textLightPrimary,
                },
              ]}
            >
              {index + 1}. {item.item.name} x {item.quantity}
            </TextComponent>
            <TextComponent
              type="caption"
              style={[
                styles.itemDescription,
                {
                  color: isDarkMode
                    ? Colors.textDarkSecondary
                    : Colors.textLightSecondary,
                },
              ]}
            >
              {item.item.description}
            </TextComponent>
            <TextComponent
              type="caption"
              style={[
                styles.optionText,
                {
                  color: isDarkMode
                    ? Colors.textDarkSecondary
                    : Colors.textLightSecondary,
                },
              ]}
            >
              Giá cơ bản: {item.item.basePrice.toLocaleString("vi-VN")} VNĐ
            </TextComponent>
            {item.options.map((option) => (
              <TextComponent
                key={option.id}
                type="caption"
                style={[
                  styles.optionText,
                  {
                    color: isDarkMode
                      ? Colors.textDarkSecondary
                      : Colors.textLightSecondary,
                  },
                ]}
              >
                - {option.optionName}: {option.optionValue} (+
                {option.additionalPrice.toLocaleString("vi-VN")} VNĐ)
              </TextComponent>
            ))}
            <TextComponent
              type="subheading"
              style={[
                styles.itemTotal,
                { color: isDarkMode ? Colors.accent : Colors.pepperoni },
              ]}
            >
              Tổng: {item.totalPrice.toLocaleString("vi-VN")} VNĐ
            </TextComponent>
          </View>
        </RowComponent>
      </CardComponent>
    ),
    [isDarkMode]
  );

  const handleToastHide = useCallback(() => {
    setToast({ ...toast, visible: false });
  }, [toast]);

  if (status === "loading") {
    return (
      <ContainerComponent style={styles.container}>
        <LoadingComponent
          loadingText="Đang tải chi tiết đơn hàng..."
          style={styles.loadingContainer}
        />
      </ContainerComponent>
    );
  }

  if (status === "failed" || !orderDetail) {
    return (
      <ContainerComponent style={styles.container}>
        <CardComponent
          title="Lỗi"
          content={error || "Không tìm thấy đơn hàng"}
          style={[
            styles.errorCard,
            {
              backgroundColor: isDarkMode ? Colors.crust : Colors.garlicCream,
              borderColor: isDarkMode ? Colors.borderDark : Colors.error,
            },
          ]}
          titleStyle={{
            color: isDarkMode
              ? Colors.textDarkPrimary
              : Colors.textLightPrimary,
          }}
        />
        <ButtonComponent
          title="Quay lại"
          type="primary"
          onPress={() => router.back()}
          style={[
            styles.backButton,
            {
              backgroundColor: isDarkMode ? Colors.primary : Colors.accent,
            },
          ]}
          textStyle={styles.backButtonText}
        />
      </ContainerComponent>
    );
  }

  return (
    <ContainerComponent
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode
            ? Colors.backgroundDark
            : Colors.backgroundLight,
        },
      ]}
      scrollable
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <CardComponent
          title={`Đơn hàng: ${orderDetail.orderCode}`}
          style={[
            styles.headerCard,
            {
              backgroundColor: isDarkMode ? Colors.crust : Colors.basil,
              borderColor: isDarkMode ? Colors.borderDark : Colors.olive,
            },
          ]}
          titleStyle={[
            styles.headerTitle,
            { color: isDarkMode ? Colors.textDarkPrimary : Colors.white },
          ]}
        >
          <RowComponent justifyContent="space-between">
            <TextComponent
              type="caption"
              style={[
                styles.headerText,
                {
                  color: isDarkMode
                    ? Colors.textDarkSecondary
                    : Colors.buttonTextPrimary,
                },
              ]}
            >
              Ngày đặt: {orderDetail.createdAt}
            </TextComponent>
            <TagComponent
              text={
                orderDetail.orderStatus === "COMPLETED"
                  ? "Đã giao"
                  : orderDetail.orderStatus === "SHIPPING"
                  ? "Đang giao"
                  : orderDetail.orderStatus === "PROCESSING"
                  ? "Đang xử lý"
                  : "Đã hủy"
              }
              type={getStatusTagType(orderDetail.orderStatus)}
            />
          </RowComponent>
        </CardComponent>

        <SpaceComponent size={16} />

        {/* Thông tin khách hàng */}
        <CardComponent
          title="Thông tin khách hàng"
          style={[
            styles.infoCard,
            {
              backgroundColor: isDarkMode ? Colors.crust : Colors.garlicCream,
              borderColor: isDarkMode ? Colors.borderDark : Colors.mushroom,
            },
          ]}
        >
          <RowComponent alignItems="center">
            <Ionicons
              name="person-outline"
              size={20}
              color={isDarkMode ? Colors.iconInactive : Colors.iconActive}
              style={styles.icon}
            />
            <TextComponent
              style={[
                styles.infoText,
                {
                  color: isDarkMode
                    ? Colors.textDarkPrimary
                    : Colors.textLightPrimary,
                },
              ]}
            >
              {orderDetail.userInfo.fullName}
            </TextComponent>
          </RowComponent>
          <RowComponent alignItems="center">
            <Ionicons
              name="mail-outline"
              size={20}
              color={isDarkMode ? Colors.iconInactive : Colors.iconActive}
              style={styles.icon}
            />
            <TextComponent
              style={[
                styles.infoText,
                {
                  color: isDarkMode
                    ? Colors.textDarkPrimary
                    : Colors.textLightPrimary,
                },
              ]}
            >
              {orderDetail.userInfo.email}
            </TextComponent>
          </RowComponent>
          <RowComponent alignItems="center">
            <Ionicons
              name="call-outline"
              size={20}
              color={isDarkMode ? Colors.iconInactive : Colors.iconActive}
              style={styles.icon}
            />
            <TextComponent
              style={[
                styles.infoText,
                {
                  color: isDarkMode
                    ? Colors.textDarkPrimary
                    : Colors.textLightPrimary,
                },
              ]}
            >
              {orderDetail.userInfo.phone}
            </TextComponent>
          </RowComponent>
          <RowComponent alignItems="center">
            <Ionicons
              name="location-outline"
              size={20}
              color={isDarkMode ? Colors.iconInactive : Colors.iconActive}
              style={styles.icon}
            />
            <TextComponent
              style={[
                styles.infoText,
                {
                  color: isDarkMode
                    ? Colors.textDarkPrimary
                    : Colors.textLightPrimary,
                },
              ]}
            >
              {orderDetail.shippingAddress}
            </TextComponent>
          </RowComponent>
        </CardComponent>

        <SpaceComponent size={16} />

        {/* Thông tin chi nhánh */}
        <CardComponent
          title="Chi nhánh"
          style={[
            styles.infoCard,
            {
              backgroundColor: isDarkMode ? Colors.crust : Colors.garlicCream,
              borderColor: isDarkMode ? Colors.borderDark : Colors.mushroom,
            },
          ]}
        >
          <RowComponent alignItems="center">
            <Ionicons
              name="storefront-outline"
              size={20}
              color={isDarkMode ? Colors.iconInactive : Colors.iconActive}
              style={styles.icon}
            />
            <TextComponent
              style={[
                styles.infoText,
                {
                  color: isDarkMode
                    ? Colors.textDarkPrimary
                    : Colors.textLightPrimary,
                },
              ]}
            >
              {orderDetail.branchInfo.name}
            </TextComponent>
          </RowComponent>
          <RowComponent alignItems="center">
            <Ionicons
              name="location-outline"
              size={20}
              color={isDarkMode ? Colors.iconInactive : Colors.iconActive}
              style={styles.icon}
            />
            <TextComponent
              style={[
                styles.infoText,
                {
                  color: isDarkMode
                    ? Colors.textDarkPrimary
                    : Colors.textLightPrimary,
                },
              ]}
            >
              {orderDetail.branchInfo.address}
            </TextComponent>
          </RowComponent>
          <RowComponent justifyContent="space-between">
            <TextComponent
              style={[
                styles.infoText,
                {
                  color: isDarkMode
                    ? Colors.textDarkPrimary
                    : Colors.textLightPrimary,
                },
              ]}
            >
              SĐT: {orderDetail.branchInfo.phone}
            </TextComponent>
            <ButtonComponent
              title="Liên hệ"
              type="outline"
              onPress={() =>
                Linking.openURL(`tel:${orderDetail.branchInfo.phone}`)
              }
              style={styles.contactButton}
              textStyle={[
                styles.contactButtonText,
                {
                  color: isDarkMode
                    ? Colors.buttonTertiary
                    : Colors.buttonTertiary,
                },
              ]}
            />
          </RowComponent>
        </CardComponent>

        <SpaceComponent size={16} />

        {/* Sản phẩm */}
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
          Sản phẩm
        </TextComponent>
        {orderDetail.items.map(renderOrderItem)}

        <SpaceComponent size={16} />

        {/* Thông tin thanh toán */}
        {orderDetail.paymentInfo && orderDetail.paymentInfo.length > 0 && (
          <>
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
              Thông tin thanh toán
            </TextComponent>
            <CardComponent
              style={[
                styles.infoCard,
                {
                  backgroundColor: isDarkMode
                    ? Colors.crust
                    : Colors.garlicCream,
                  borderColor: isDarkMode ? Colors.borderDark : Colors.mushroom,
                },
              ]}
            >
              <RowComponent alignItems="center">
                <Ionicons
                  name="card-outline"
                  size={20}
                  color={isDarkMode ? Colors.iconInactive : Colors.iconActive}
                  style={styles.icon}
                />
                <TextComponent
                  style={[
                    styles.infoText,
                    {
                      color: isDarkMode
                        ? Colors.textDarkPrimary
                        : Colors.textLightPrimary,
                    },
                  ]}
                >
                  Phương thức: {orderDetail.paymentInfo[0].paymentMethod}
                </TextComponent>
              </RowComponent>
              <RowComponent alignItems="center">
                <Ionicons
                  name="checkmark-done-outline"
                  size={20}
                  color={isDarkMode ? Colors.iconInactive : Colors.iconActive}
                  style={styles.icon}
                />
                <TextComponent
                  style={[
                    styles.infoText,
                    {
                      color: isDarkMode
                        ? Colors.textDarkPrimary
                        : Colors.textLightPrimary,
                    },
                  ]}
                >
                  Trạng thái: {orderDetail.paymentInfo[0].paymentStatus}
                </TextComponent>
              </RowComponent>
              <TextComponent
                style={[
                  styles.infoText,
                  {
                    color: isDarkMode
                      ? Colors.textDarkPrimary
                      : Colors.textLightPrimary,
                  },
                ]}
              >
                Mã giao dịch: {orderDetail.paymentInfo[0].transactionCode}
              </TextComponent>
            </CardComponent>
          </>
        )}

        <SpaceComponent size={16} />

        {/* Điểm thưởng */}
        {orderDetail.pointsEarnedOrSpent !== undefined &&
          orderDetail.loyaltyTransactionDescription && (
            <>
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
                Điểm thưởng
              </TextComponent>
              <CardComponent
                style={[
                  styles.infoCard,
                  {
                    backgroundColor: isDarkMode
                      ? Colors.crust
                      : Colors.garlicCream,
                    borderColor: isDarkMode
                      ? Colors.borderDark
                      : Colors.mushroom,
                  },
                ]}
              >
                <RowComponent alignItems="center">
                  <Ionicons
                    name="star-outline"
                    size={20}
                    color={isDarkMode ? Colors.iconInactive : Colors.iconActive}
                    style={styles.icon}
                  />
                  <TextComponent
                    style={[
                      styles.infoText,
                      {
                        color: isDarkMode
                          ? Colors.textDarkPrimary
                          : Colors.textLightPrimary,
                      },
                    ]}
                  >
                    {orderDetail.loyaltyTransactionDescription} (
                    {orderDetail.pointsEarnedOrSpent} điểm)
                  </TextComponent>
                </RowComponent>
              </CardComponent>
            </>
          )}

        <SpaceComponent size={16} />

        {/* Ghi chú */}
        {orderDetail.note && (
          <>
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
              Ghi chú
            </TextComponent>
            <CardComponent
              style={[
                styles.infoCard,
                {
                  backgroundColor: isDarkMode
                    ? Colors.crust
                    : Colors.garlicCream,
                  borderColor: isDarkMode ? Colors.borderDark : Colors.mushroom,
                },
              ]}
            >
              <RowComponent alignItems="center">
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color={isDarkMode ? Colors.iconInactive : Colors.iconActive}
                  style={styles.icon}
                />
                <TextComponent
                  style={[
                    styles.infoText,
                    {
                      color: isDarkMode
                        ? Colors.textDarkPrimary
                        : Colors.textLightPrimary,
                    },
                  ]}
                >
                  {orderDetail.note}
                </TextComponent>
              </RowComponent>
            </CardComponent>
          </>
        )}

        <SpaceComponent size={16} />

        {/* Tổng cộng */}
        <CardComponent
          style={[
            styles.totalCard,
            {
              backgroundColor: isDarkMode
                ? Colors.backgroundDark
                : Colors.mozzarella,
              borderColor: isDarkMode ? Colors.borderDark : Colors.mushroom,
            },
          ]}
        >
          <RowComponent justifyContent="space-between">
            <TextComponent
              type="subheading"
              style={[
                styles.totalText,
                {
                  color: isDarkMode
                    ? Colors.textDarkPrimary
                    : Colors.textLightPrimary,
                },
              ]}
            >
              Tổng cộng
            </TextComponent>
            <TextComponent
              type="subheading"
              style={[
                styles.totalPrice,
                { color: isDarkMode ? Colors.accent : Colors.accent },
              ]}
            >
              {orderDetail.totalPrice.toLocaleString("vi-VN")} VNĐ
            </TextComponent>
          </RowComponent>
        </CardComponent>

        <SpaceComponent size={16} />

        {/* Nút hành động */}
        <RowComponent justifyContent="space-between">
          <ButtonComponent
            title="Quay lại"
            type="outline"
            onPress={() => router.back()}
            style={[
              styles.backButton,
              {
                borderColor: isDarkMode ? Colors.borderDark : Colors.crust,
                backgroundColor: isDarkMode
                  ? Colors.backgroundDark
                  : Colors.white,
              },
            ]}
            textStyle={[
              styles.backButtonText,
              {
                color: isDarkMode
                  ? Colors.textDarkPrimary
                  : Colors.textLightPrimary,
              },
            ]}
          />
          {orderDetail.orderStatus === "PROCESSING" && (
            <ButtonComponent
              title="Hủy đơn"
              type="outline"
              onPress={confirmCancelOrder}
              style={[
                styles.backButton,
                {
                  borderColor: Colors.error,
                  backgroundColor: isDarkMode
                    ? Colors.backgroundDark
                    : Colors.white,
                },
              ]}
              textStyle={[styles.backButtonText, { color: Colors.error }]}
            />
          )}
        </RowComponent>

        <SpaceComponent size={16} />
      </ScrollView>
      <ToastComponent
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={handleToastHide}
        duration={3000}
        style={styles.toast}
      />
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  headerCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  headerText: {
    fontSize: 14,
  },
  infoCard: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    marginVertical: 8,
  },
  orderItemCard: {
    borderWidth: 1,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    elevation: 3,
  },
  totalCard: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    marginLeft: 8,
  },
  itemImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 2,
    borderColor: Colors.mozzarella,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontWeight: "700",
    fontSize: 16,
  },
  itemDescription: {
    marginVertical: 4,
    lineHeight: 18,
  },
  optionText: {
    marginLeft: 8,
    fontSize: 12,
  },
  itemTotal: {
    marginTop: 8,
    textAlign: "right",
    fontWeight: "700",
  },
  totalText: {
    fontWeight: "700",
  },
  totalPrice: {
    fontWeight: "700",
    fontSize: 18,
  },
  backButton: {
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
  },
  contactButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  contactButtonText: {
    fontSize: 14,
  },
  icon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
  errorCard: {
    borderWidth: 1,
    borderRadius: 12,
  },
  toast: {
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    bottom: 20,
  },
});

export default OrderDetailScreen;
