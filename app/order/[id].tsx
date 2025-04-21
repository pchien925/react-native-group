import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Linking } from "react-native";
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
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

// Mock data matching IOrderDetail
const fetchOrderDetail = async (orderId: number): Promise<IOrderDetail> => {
  return {
    id: orderId,
    orderCode: `ORD${orderId}`,
    totalPrice: 150000,
    orderStatus: "PROCESSING", // Set to PROCESSING to test cancel button
    createdAt: new Date().toLocaleString("vi-VN"),
    updatedAt: new Date().toLocaleString("vi-VN"),
    note: "Giao hàng nhanh, thêm nhiều phô mai",
    shippingAddress: "123 Đường ABC, Quận 1, TP.HCM",
    paymentMethod: "Thẻ tín dụng",
    userInfo: {
      id: 1,
      fullName: "Nguyễn Văn A",
      email: "nva@example.com",
      phone: "0901234567",
    },
    branchInfo: {
      id: 1,
      name: "Chi nhánh Quận 1",
      address: "456 Đường XYZ, Quận 1, TP.HCM",
      phone: "02812345678",
    },
    items: [
      {
        id: 1,
        item: {
          id: 1,
          name: "Pizza Hải sản",
          description: "Pizza với tôm, mực, và phô mai mozzarella thơm ngon",
          imageUrl:
            "https://img-global.cpcdn.com/recipes/cfa5ea1331a1b04e/680x482cq70/mi-y-cua-4ps-recipe-main-photo.jpg",
          basePrice: 55000,
        },
        quantity: 2,
        pricePerUnit: 60000,
        totalPrice: 120000,
        options: [
          {
            id: 1,
            optionName: "Kích thước",
            optionValue: "Lớn",
            additionalPrice: 10000,
          },
          {
            id: 2,
            optionName: "Viền",
            optionValue: "Phô mai",
            additionalPrice: 5000,
          },
        ],
      },
      {
        id: 2,
        item: {
          id: 2,
          name: "Pizza Hải sản",
          description: "Pizza với tôm, mực, và phô mai mozzarella thơm ngon",
          imageUrl:
            "https://img-global.cpcdn.com/recipes/cfa5ea1331a1b04e/680x482cq70/mi-y-cua-4ps-recipe-main-photo.jpg",
          basePrice: 55000,
        },
        quantity: 2,
        pricePerUnit: 60000,
        totalPrice: 120000,
        options: [
          {
            id: 1,
            optionName: "Kích thước",
            optionValue: "Lớn",
            additionalPrice: 10000,
          },
          {
            id: 2,
            optionName: "Viền",
            optionValue: "Phô mai",
            additionalPrice: 5000,
          },
        ],
      },
    ],
    paymentInfo: [
      {
        id: 1,
        paymentMethod: "Thẻ tín dụng",
        paymentStatus: "Đã thanh toán",
        transactionCode: "TXN123456",
        paidAt: new Date().toLocaleString("vi-VN"),
        amount: 150000,
      },
    ],
    pointsEarnedOrSpent: 15,
    loyaltyTransactionDescription: "Nhận 15 điểm thưởng",
  };
};

const OrderDetailScreen = () => {
  const { id } = useLocalSearchParams();
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

  useEffect(() => {
    if (status === "idle" && id) {
      setStatus("loading");
      fetchOrderDetail(Number(id))
        .then((data) => {
          setOrderDetail(data);
          setStatus("succeeded");
        })
        .catch(() => {
          setError("Lỗi tải chi tiết đơn hàng");
          setStatus("failed");
        });
    }
  }, [status, id]);

  const getStatusTagType = (
    status: string
  ): "success" | "warning" | "error" | "info" => {
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
  };

  const handleCancelOrder = () => {
    // Giả lập hủy đơn hàng (thay bằng API thực tế nếu có)
    setToast({
      message: "Đã gửi yêu cầu hủy đơn hàng!",
      type: "success",
      visible: true,
    });
    // Cập nhật trạng thái đơn hàng (giả lập)
    if (orderDetail) {
      setOrderDetail({ ...orderDetail, orderStatus: "CANCELED" });
    }
  };

  const renderOrderItem = (item: IOrderItem, index: number) => (
    <CardComponent key={item.id} style={styles.orderItemCard}>
      <RowComponent alignItems="flex-start">
        <ImageComponent
          source={{ uri: item.item.imageUrl }}
          style={styles.itemImage}
        />
        <View style={styles.itemDetails}>
          <TextComponent type="subheading" style={styles.itemName}>
            {index + 1}. {item.item.name} x {item.quantity}
          </TextComponent>
          <TextComponent type="caption" style={styles.itemDescription}>
            {item.item.description}
          </TextComponent>
          <TextComponent type="caption" style={styles.optionText}>
            Giá cơ bản: {item.item.basePrice.toLocaleString("vi-VN")} VNĐ
          </TextComponent>
          {item.options.map((option) => (
            <TextComponent
              key={option.id}
              type="caption"
              style={styles.optionText}
            >
              - {option.optionName}: {option.optionValue} (+
              {option.additionalPrice.toLocaleString("vi-VN")} VNĐ)
            </TextComponent>
          ))}
          <TextComponent type="subheading" style={styles.itemTotal}>
            Tổng: {item.totalPrice.toLocaleString("vi-VN")} VNĐ
          </TextComponent>
        </View>
      </RowComponent>
    </CardComponent>
  );

  if (status === "loading") {
    return (
      <ContainerComponent style={styles.container}>
        <TextComponent type="subheading" style={styles.loadingText}>
          Đang tải...
        </TextComponent>
      </ContainerComponent>
    );
  }

  if (status === "failed" || !orderDetail) {
    return (
      <ContainerComponent style={styles.container}>
        <CardComponent
          title="Lỗi"
          content={error || "Không tìm thấy đơn hàng"}
          style={styles.errorCard}
        />
        <ButtonComponent
          title="Quay lại"
          type="primary"
          onPress={() => router.back()}
          style={styles.backButton}
        />
      </ContainerComponent>
    );
  }

  return (
    <ContainerComponent style={styles.container} scrollable>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <CardComponent
          title={`Đơn hàng: ${orderDetail.orderCode}`}
          style={styles.headerCard}
          titleStyle={styles.headerTitle}
        >
          <RowComponent justifyContent="space-between">
            <TextComponent type="caption" style={styles.headerText}>
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
        <CardComponent title="Thông tin khách hàng" style={styles.infoCard}>
          <RowComponent alignItems="center">
            <Ionicons
              name="person-outline"
              size={20}
              color={Colors.iconActive}
              style={styles.icon}
            />
            <TextComponent style={styles.infoText}>
              {orderDetail.userInfo.fullName}
            </TextComponent>
          </RowComponent>
          <RowComponent alignItems="center">
            <Ionicons
              name="mail-outline"
              size={20}
              color={Colors.iconActive}
              style={styles.icon}
            />
            <TextComponent style={styles.infoText}>
              {orderDetail.userInfo.email}
            </TextComponent>
          </RowComponent>
          <RowComponent alignItems="center">
            <Ionicons
              name="call-outline"
              size={20}
              color={Colors.iconActive}
              style={styles.icon}
            />
            <TextComponent style={styles.infoText}>
              {orderDetail.userInfo.phone}
            </TextComponent>
          </RowComponent>
          <RowComponent alignItems="center">
            <Ionicons
              name="location-outline"
              size={20}
              color={Colors.iconActive}
              style={styles.icon}
            />
            <TextComponent style={styles.infoText}>
              {orderDetail.shippingAddress}
            </TextComponent>
          </RowComponent>
        </CardComponent>

        <SpaceComponent size={16} />

        {/* Thông tin chi nhánh */}
        <CardComponent title="Chi nhánh" style={styles.infoCard}>
          <RowComponent alignItems="center">
            <Ionicons
              name="storefront-outline"
              size={20}
              color={Colors.iconActive}
              style={styles.icon}
            />
            <TextComponent style={styles.infoText}>
              {orderDetail.branchInfo.name}
            </TextComponent>
          </RowComponent>
          <RowComponent alignItems="center">
            <Ionicons
              name="location-outline"
              size={20}
              color={Colors.iconActive}
              style={styles.icon}
            />
            <TextComponent style={styles.infoText}>
              {orderDetail.branchInfo.address}
            </TextComponent>
          </RowComponent>
          <RowComponent justifyContent="space-between">
            <TextComponent style={styles.infoText}>
              SĐT: {orderDetail.branchInfo.phone}
            </TextComponent>
            <ButtonComponent
              title="Liên hệ"
              type="outline"
              onPress={() =>
                Linking.openURL(`tel:${orderDetail.branchInfo.phone}`)
              }
              style={styles.contactButton}
              textStyle={styles.contactButtonText}
            />
          </RowComponent>
        </CardComponent>

        <SpaceComponent size={16} />

        {/* Sản phẩm */}
        <TextComponent type="subheading" style={styles.sectionTitle}>
          Sản phẩm
        </TextComponent>
        {orderDetail.items.map(renderOrderItem)}

        <SpaceComponent size={16} />

        {/* Thông tin thanh toán */}
        {orderDetail.paymentInfo && orderDetail.paymentInfo.length > 0 && (
          <>
            <TextComponent type="subheading" style={styles.sectionTitle}>
              Thông tin thanh toán
            </TextComponent>
            <CardComponent style={styles.infoCard}>
              <RowComponent alignItems="center">
                <Ionicons
                  name="card-outline"
                  size={20}
                  color={Colors.iconActive}
                  style={styles.icon}
                />
                <TextComponent style={styles.infoText}>
                  Phương thức: {orderDetail.paymentInfo[0].paymentMethod}
                </TextComponent>
              </RowComponent>
              <RowComponent alignItems="center">
                <Ionicons
                  name="checkmark-done-outline"
                  size={20}
                  color={Colors.iconActive}
                  style={styles.icon}
                />
                <TextComponent style={styles.infoText}>
                  Trạng thái: {orderDetail.paymentInfo[0].paymentStatus}
                </TextComponent>
              </RowComponent>
              <TextComponent style={styles.infoText}>
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
              <TextComponent type="subheading" style={styles.sectionTitle}>
                Điểm thưởng
              </TextComponent>
              <CardComponent style={styles.infoCard}>
                <RowComponent alignItems="center">
                  <Ionicons
                    name="star-outline"
                    size={20}
                    color={Colors.iconActive}
                    style={styles.icon}
                  />
                  <TextComponent style={styles.infoText}>
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
            <TextComponent type="subheading" style={styles.sectionTitle}>
              Ghi chú
            </TextComponent>
            <CardComponent style={styles.infoCard}>
              <RowComponent alignItems="center">
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color={Colors.iconActive}
                  style={styles.icon}
                />
                <TextComponent style={styles.infoText}>
                  {orderDetail.note}
                </TextComponent>
              </RowComponent>
            </CardComponent>
          </>
        )}

        <SpaceComponent size={16} />

        {/* Tổng cộng */}
        <CardComponent style={styles.totalCard}>
          <RowComponent justifyContent="space-between">
            <TextComponent type="subheading" style={styles.totalText}>
              Tổng cộng
            </TextComponent>
            <TextComponent type="subheading" style={styles.totalPrice}>
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
            style={styles.backButton}
            textStyle={styles.backButtonText}
          />
          {orderDetail.orderStatus === "PROCESSING" && (
            <ButtonComponent
              title="Hủy đơn"
              type="outline"
              onPress={handleCancelOrder}
              style={[styles.backButton, { borderColor: Colors.error }]}
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
        onHide={() => setToast({ ...toast, visible: false })}
        duration={3000}
        style={styles.toast}
      />
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.backgroundLight,
  },
  headerCard: {
    backgroundColor: Colors.basil,
    borderColor: Colors.olive,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    elevation: 4,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
  headerText: {
    color: Colors.buttonTextPrimary,
  },
  infoCard: {
    backgroundColor: Colors.garlicCream,
    borderColor: Colors.mushroom,
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    marginVertical: 8,
  },
  orderItemCard: {
    backgroundColor: Colors.garlicCream,
    borderColor: Colors.mushroom,
    borderWidth: 1,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    elevation: 3,
  },
  totalCard: {
    backgroundColor: Colors.mozzarella,
    borderColor: Colors.mushroom,
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    color: Colors.textLightPrimary,
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
    color: Colors.textLightPrimary,
    fontWeight: "700",
    fontSize: 16,
  },
  itemDescription: {
    color: Colors.textLightSecondary,
    marginVertical: 4,
    lineHeight: 18,
  },
  optionText: {
    marginLeft: 8,
    fontSize: 12,
    color: Colors.textLightSecondary,
  },
  itemTotal: {
    marginTop: 8,
    textAlign: "right",
    color: Colors.pepperoni,
    fontWeight: "700",
  },
  totalText: {
    color: Colors.textLightPrimary,
    fontWeight: "700",
  },
  totalPrice: {
    color: Colors.accent,
    fontWeight: "700",
    fontSize: 18,
  },
  backButton: {
    flex: 1,
    marginRight: 8,
    borderColor: Colors.crust,
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: Colors.white,
  },
  backButtonText: {
    color: Colors.textLightPrimary,
    fontSize: 16,
  },
  contactButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderColor: Colors.buttonTertiary,
    borderWidth: 1,
  },
  contactButtonText: {
    color: Colors.buttonTertiary,
    fontSize: 14,
  },
  icon: {
    marginRight: 8,
  },
  infoText: {
    color: Colors.textLightPrimary,
    fontSize: 14,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    color: Colors.textLightPrimary,
  },
  errorCard: {
    backgroundColor: Colors.garlicCream,
    borderColor: Colors.error,
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
