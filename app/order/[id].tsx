import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Linking,
  Alert,
  View,
  Animated,
  Pressable,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import * as Haptics from "expo-haptics";
import ContainerComponent from "@/components/common/ContainerComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import TextComponent from "@/components/common/TextComponent";
import ButtonComponent from "@/components/common/ButtonComponent";
import CardComponent from "@/components/common/CardComponent";
import RowComponent from "@/components/common/RowComponent";
import TagComponent from "@/components/common/TagComponent";
import ImageComponent from "@/components/common/ImageComponent";
import LoadingComponent from "@/components/common/LoadingComponent";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { getOrderByIdApi, cancelOrderApi } from "@/services/api";
import Toast from "react-native-toast-message"; // Import Toast

const OrderDetailScreen: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { id, userId } = useLocalSearchParams();
  const [orderDetail, setOrderDetail] = useState<IOrderDetail | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "succeeded" | "failed"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0]; // Animation for card components

  // Fetch order details
  const fetchOrder = useCallback(async () => {
    if (!id || !userId) return;
    setStatus("loading");
    try {
      const response: IBackendResponse<IOrderDetail> = await getOrderByIdApi(
        Number(id),
        Number(userId)
      );
      if (response.error || !response.data) {
        throw new Error(response.message || "Không thể tải chi tiết đơn hàng");
      }
      setOrderDetail(response.data);
      setStatus("succeeded");
      // Animate cards on load
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    } catch (err: any) {
      setError(err.message || "Lỗi tải chi tiết đơn hàng");
      setStatus("failed");
      Toast.show({
        type: "error",
        text1: err.message || "Lỗi tải chi tiết đơn hàng",
        visibilityTime: 3000,
      });
    }
  }, [id, userId, fadeAnim]);

  useEffect(() => {
    if (status === "idle" && id && userId) {
      fetchOrder();
    }
  }, [status, id, userId, fetchOrder]);

  // Handle order cancellation
  const handleCancelOrder = useCallback(async () => {
    if (!id || !userId) return;
    try {
      const response = await cancelOrderApi(Number(id), Number(userId));
      if (response.error || !response.data) {
        throw new Error(response.message || "Không thể hủy đơn hàng");
      }
      const updatedOrderResponse = await getOrderByIdApi(
        Number(id),
        Number(userId)
      );
      if (updatedOrderResponse.error || !updatedOrderResponse.data) {
        throw new Error(
          updatedOrderResponse.message || "Không thể cập nhật đơn hàng"
        );
      }
      setOrderDetail(updatedOrderResponse.data);
      Toast.show({
        type: "success",
        text1: "Đơn hàng đã được hủy thành công!",
        visibilityTime: 3000,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: err.message || "Không thể hủy đơn hàng",
        visibilityTime: 3000,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [id, userId]);

  // Confirm cancellation
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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [handleCancelOrder]);

  // Map status to tag type
  const getStatusTagType = useCallback(
    (
      status: IOrderDetail["orderStatus"]
    ): "success" | "warning" | "error" | "info" => {
      switch (status) {
        case "COMPLETED":
          return "success";
        case "SHIPPING":
        case "PROCESSING":
          return "warning";
        case "CANCELLED":
          return "error";
        default:
          return "info";
      }
    },
    []
  );

  // Render order item
  const renderOrderItem = useCallback(
    (item: IOrderItem, index: number) => (
      <Animated.View
        key={item.id}
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        }}
      >
        <CardComponent
          style={[
            styles.orderItemCard,
            {
              backgroundColor: isDarkMode ? Colors.crust : Colors.garlicCream,
              borderColor: isDarkMode ? Colors.borderDark : Colors.mushroom,
            },
          ]}
        >
          <RowComponent alignItems="flex-start">
            {item.menuItem?.imageUrl ? (
              <ImageComponent
                source={{ uri: item.menuItem.imageUrl }}
                style={styles.itemImage}
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons
                  name="image-outline"
                  size={40}
                  color={
                    isDarkMode
                      ? Colors.textDarkSecondary
                      : Colors.textLightSecondary
                  }
                />
              </View>
            )}
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
                {index + 1}. {item.menuItem?.name || "Không xác định"} x{" "}
                {item.quantity}
              </TextComponent>
              {item.menuItem?.description && (
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
                  {item.menuItem.description}
                </TextComponent>
              )}
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
                Giá cơ bản:
                {(item.menuItem?.basePrice || 0).toLocaleString("vi-VN")} VNĐ
              </TextComponent>
              {item.options?.map((option) => (
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
      </Animated.View>
    ),
    [isDarkMode, fadeAnim]
  );

  // Loading state
  if (status === "loading") {
    return (
      <ContainerComponent style={styles.container}>
        <LoadingComponent
          loadingText="Đang tải chi tiết đơn hàng..."
          size="large"
          style={styles.loadingContainer}
          accessibilityLabel="Đang tải chi tiết đơn hàng"
        />
      </ContainerComponent>
    );
  }

  // Error or no order state
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
          title="Thử lại"
          type="primary"
          onPress={() => setStatus("idle")}
          style={styles.actionButton}
          accessibilityLabel="Thử lại tải đơn hàng"
        />
        <ButtonComponent
          title="Quay lại"
          type="outline"
          onPress={() => router.back()}
          style={styles.actionButton}
          accessibilityLabel="Quay lại danh sách đơn hàng"
        />
      </ContainerComponent>
    );
  }

  // Main render
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
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View style={{ opacity: fadeAnim }}>
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
            <RowComponent justifyContent="space-between" alignItems="center">
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
                Ngày đặt:
                {new Date(orderDetail.createdAt).toLocaleDateString("vi-VN")}
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
        </Animated.View>

        <SpaceComponent size={16} />

        {/* Customer Info */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
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
                {orderDetail.user.fullName}
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
                {orderDetail.user.email}
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
                {orderDetail.user.phone}
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
        </Animated.View>

        <SpaceComponent size={16} />

        {/* Branch Info */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
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
                {orderDetail.branch.name}
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
                {orderDetail.branch.address}
              </TextComponent>
            </RowComponent>
            <RowComponent justifyContent="space-between" alignItems="center">
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
                SĐT: {orderDetail.branch.phone}
              </TextComponent>
              <ButtonComponent
                title="Liên hệ"
                type="outline"
                onPress={() =>
                  Linking.openURL(`tel:${orderDetail.branch.phone}`)
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
                accessibilityLabel="Liên hệ chi nhánh"
              />
            </RowComponent>
          </CardComponent>
        </Animated.View>

        <SpaceComponent size={16} />

        {/* Items */}
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

        {/* Payment Info */}
        {orderDetail.payments?.length > 0 && (
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
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
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
                    Phương thức: {orderDetail.payments[0].paymentMethod}
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
                    Trạng thái: {orderDetail.payments[0].status}
                  </TextComponent>
                </RowComponent>
                <RowComponent alignItems="center">
                  <Ionicons
                    name="barcode-outline"
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
                    Mã giao dịch: {orderDetail.payments[0].transactionCode}
                  </TextComponent>
                </RowComponent>
              </CardComponent>
            </Animated.View>
          </>
        )}

        <SpaceComponent size={16} />

        {/* Shipment Info */}
        {orderDetail.shipment && (
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
              Thông tin vận chuyển
            </TextComponent>
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
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
                    name="bicycle-outline"
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
                    Trạng thái: {orderDetail.shipment.deliveryStatus}
                  </TextComponent>
                </RowComponent>
                {orderDetail.shipment.trackingEvents?.map((event) => (
                  <RowComponent
                    key={event.id}
                    alignItems="flex-start"
                    style={styles.trackingEvent}
                  >
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color={
                        isDarkMode ? Colors.iconInactive : Colors.iconActive
                      }
                      style={styles.icon}
                    />
                    <View>
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
                        {event.deliveryStatus} -{" "}
                        {new Date(event.eventTime).toLocaleString("vi-VN")}
                      </TextComponent>
                      {event.note && (
                        <TextComponent
                          style={[
                            styles.infoText,
                            {
                              color: isDarkMode
                                ? Colors.textDarkSecondary
                                : Colors.textLightSecondary,
                            },
                          ]}
                        >
                          Ghi chú: {event.note}
                        </TextComponent>
                      )}
                    </View>
                  </RowComponent>
                ))}
              </CardComponent>
            </Animated.View>
          </>
        )}

        <SpaceComponent size={16} />

        {/* Note */}
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
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0],
                    }),
                  },
                ],
              }}
            >
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
            </Animated.View>
          </>
        )}

        <SpaceComponent size={16} />

        {/* Total */}
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          }}
        >
          <CardComponent
            style={[
              styles.totalCard,
              {
                backgroundColor: isDarkMode ? Colors.crust : Colors.mozzarella,
                borderColor: isDarkMode ? Colors.borderDark : Colors.mushroom,
              },
            ]}
          >
            <RowComponent justifyContent="space-between" alignItems="center">
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
              <TextComponent type="subheading" style={[styles.totalPrice]}>
                {orderDetail.totalPrice.toLocaleString("vi-VN")} VNĐ
              </TextComponent>
            </RowComponent>
          </CardComponent>
        </Animated.View>

        <SpaceComponent size={16} />

        {/* Actions */}
        <RowComponent justifyContent="space-between">
          <Pressable
            onPress={() => {
              router.back();
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            style={({ pressed }) => [
              styles.actionButton,
              {
                borderColor: isDarkMode ? Colors.borderDark : Colors.crust,
                backgroundColor: isDarkMode
                  ? Colors.backgroundDark
                  : Colors.white,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            accessibilityLabel="Quay lại danh sách đơn hàng"
          >
            <TextComponent
              style={[
                styles.actionButtonText,
                {
                  color: isDarkMode
                    ? Colors.textDarkPrimary
                    : Colors.textLightPrimary,
                },
              ]}
            >
              Quay lại
            </TextComponent>
          </Pressable>
          {orderDetail.orderStatus === "PROCESSING" && (
            <Pressable
              onPress={confirmCancelOrder}
              style={({ pressed }) => [
                styles.actionButton,
                {
                  borderColor: Colors.error,
                  backgroundColor: isDarkMode
                    ? Colors.backgroundDark
                    : Colors.white,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              accessibilityLabel="Hủy đơn hàng"
            >
              <TextComponent
                style={[styles.actionButtonText, { color: Colors.error }]}
              >
                Hủy đơn
              </TextComponent>
            </Pressable>
          )}
        </RowComponent>

        <SpaceComponent size={24} />
      </ScrollView>
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  headerCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  headerText: {
    fontSize: 14,
    lineHeight: 20,
  },
  infoCard: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderItemCard: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 16,
    marginVertical: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalCard: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
    marginBottom: 12,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.mozzarella,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: Colors.mozzarella,
    justifyContent: "center",
    alignItems: "center",
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 22,
  },
  itemDescription: {
    fontSize: 12,
    lineHeight: 18,
    marginVertical: 4,
  },
  optionText: {
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 8,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "right",
    marginTop: 8,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "700",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.pepperoni,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  contactButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  icon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  trackingEvent: {
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
  errorCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
  },
});

export default React.memo(OrderDetailScreen);
