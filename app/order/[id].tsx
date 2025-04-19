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
import ProgressComponent from "@/components/common/ProgressComponent";
import ImageComponent from "@/components/common/ImageComponent";
import { Colors } from "@/constants/Colors";

const fetchOrderDetail = async (orderId: number): Promise<IOrderDetail> => {
  // Giả lập dữ liệu (thay bằng API thật)
  return {
    id: orderId,
    orderCode: `ORD${orderId}`,
    totalPrice: 150000,
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
    shipmentInfo: [
      {
        id: 1,
        deliveryStatus: "Đang giao",
        trackingHistory: [
          {
            id: 1,
            deliveryStatus: "Đã nhận đơn",
            note: "Đơn hàng đã được xác nhận",
            eventTime: new Date().toLocaleString("vi-VN"),
            locationLatitude: 10.7769,
            locationLongitude: 106.7009,
          },
          {
            id: 2,
            deliveryStatus: "Đang giao",
            note: "Đang giao đến khách hàng",
            eventTime: new Date().toLocaleString("vi-VN"),
            locationLatitude: 10.7769,
            locationLongitude: 106.7009,
          },
        ],
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

  const getDeliveryProgress = (status: string): number => {
    switch (status) {
      case "Đã nhận đơn":
        return 25;
      case "Đang xử lý":
        return 50;
      case "Đang giao":
        return 75;
      case "Đã giao":
        return 100;
      default:
        return 0;
    }
  };

  const getDeliveryTagType = (
    status: string
  ): "success" | "warning" | "error" | "info" => {
    switch (status) {
      case "Đã giao":
        return "success";
      case "Đang giao":
      case "Đang xử lý":
        return "warning";
      case "Đã hủy":
        return "error";
      default:
        return "info";
    }
  };

  const renderOrderItem = (item: IOrderItem) => (
    <CardComponent
      key={item.id}
      style={styles.orderItemCard}
      onPress={() => router.push(`/menu-item/${item.item.id}`)}
    >
      <RowComponent alignItems="flex-start">
        <ImageComponent
          source={{ uri: item.item.imageUrl }}
          style={styles.itemImage}
        />
        <View style={styles.itemDetails}>
          <TextComponent type="subheading" style={styles.itemName}>
            {item.item.name} x {item.quantity}
          </TextComponent>
          <TextComponent type="caption" style={styles.itemDescription}>
            {item.item.description}
          </TextComponent>
          <TextComponent type="caption" style={styles.itemPrice}>
            Giá gốc: {item.item.basePrice.toLocaleString("vi-VN")} VNĐ
          </TextComponent>
          <TextComponent type="caption" style={styles.itemPrice}>
            Giá mỗi món: {item.pricePerUnit.toLocaleString("vi-VN")} VNĐ
          </TextComponent>
          {item.options.map((option: IOrderOption) => (
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
      <ButtonComponent
        title="Xem chi tiết món"
        type="text"
        onPress={() => router.push(`/menu-item/${item.item.id}`)}
        style={styles.viewItemButton}
        textStyle={styles.viewItemButtonText}
      />
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
        {/* Tiêu đề đơn hàng */}
        <CardComponent
          title={`Đơn hàng: ${orderDetail.orderCode}`}
          style={styles.headerCard}
          titleStyle={styles.headerTitle}
        >
          <RowComponent justifyContent="space-between">
            <TextComponent type="caption">
              Ngày đặt: {orderDetail.createdAt}
            </TextComponent>
            <TagComponent
              text={
                orderDetail.paymentInfo?.[0]?.paymentStatus || "Chưa thanh toán"
              }
              type={
                orderDetail.paymentInfo?.[0]?.paymentStatus === "Đã thanh toán"
                  ? "success"
                  : "warning"
              }
            />
          </RowComponent>
        </CardComponent>

        <SpaceComponent size={16} />

        {/* Thông tin khách hàng */}
        <CardComponent title="Thông tin khách hàng" style={styles.infoCard}>
          <TextComponent>Tên: {orderDetail.userInfo.fullName}</TextComponent>
          <TextComponent>Email: {orderDetail.userInfo.email}</TextComponent>
          <TextComponent>SĐT: {orderDetail.userInfo.phone}</TextComponent>
          <TextComponent>Địa chỉ: {orderDetail.shippingAddress}</TextComponent>
        </CardComponent>

        <SpaceComponent size={16} />

        {/* Thông tin chi nhánh */}
        <CardComponent title="Chi nhánh" style={styles.infoCard}>
          <TextComponent>Tên: {orderDetail.branchInfo.name}</TextComponent>
          <TextComponent>
            Địa chỉ: {orderDetail.branchInfo.address}
          </TextComponent>
          <RowComponent justifyContent="space-between">
            <TextComponent>SĐT: {orderDetail.branchInfo.phone}</TextComponent>
            <ButtonComponent
              title="Liên hệ"
              type="outline"
              onPress={() =>
                Linking.openURL(`tel:${orderDetail.branchInfo.phone}`)
              }
              style={styles.contactButton}
            />
          </RowComponent>
        </CardComponent>

        <SpaceComponent size={16} />

        {/* Thông tin sản phẩm */}
        <TextComponent type="subheading" style={styles.sectionTitle}>
          Sản phẩm
        </TextComponent>
        {orderDetail.items.map(renderOrderItem)}

        <SpaceComponent size={16} />

        {/* Thông tin vận chuyển */}
        {orderDetail.shipmentInfo && (
          <>
            <TextComponent type="subheading" style={styles.sectionTitle}>
              Tiến độ vận chuyển
            </TextComponent>
            <CardComponent style={styles.infoCard}>
              <RowComponent justifyContent="space-between">
                <TextComponent>Trạng thái:</TextComponent>
                <TagComponent
                  text={orderDetail.shipmentInfo[0]?.deliveryStatus}
                  type={getDeliveryTagType(
                    orderDetail.shipmentInfo[0]?.deliveryStatus
                  )}
                />
              </RowComponent>
              <ProgressComponent
                progress={getDeliveryProgress(
                  orderDetail.shipmentInfo[0]?.deliveryStatus
                )}
                style={styles.progressBar}
              />
              {orderDetail.shipmentInfo[0]?.trackingHistory.map((event) => (
                <TextComponent
                  key={event.id}
                  type="caption"
                  style={styles.trackingText}
                >
                  {event.eventTime}: {event.deliveryStatus} - {event.note}
                </TextComponent>
              ))}
            </CardComponent>
            <SpaceComponent size={16} />
          </>
        )}

        {/* Thông tin thanh toán */}
        {orderDetail.paymentInfo && (
          <>
            <TextComponent type="subheading" style={styles.sectionTitle}>
              Thông tin thanh toán
            </TextComponent>
            <CardComponent style={styles.infoCard}>
              <TextComponent>
                Phương thức: {orderDetail.paymentInfo[0]?.paymentMethod}
              </TextComponent>
              <TextComponent>
                Trạng thái: {orderDetail.paymentInfo[0]?.paymentStatus}
              </TextComponent>
              <TextComponent>
                Mã giao dịch: {orderDetail.paymentInfo[0]?.transactionCode}
              </TextComponent>
              <TextComponent>
                Thời gian: {orderDetail.paymentInfo[0]?.paidAt}
              </TextComponent>
            </CardComponent>
            <SpaceComponent size={16} />
          </>
        )}

        {/* Điểm thưởng */}
        {orderDetail.pointsEarnedOrSpent && (
          <>
            <TextComponent type="subheading" style={styles.sectionTitle}>
              Điểm thưởng
            </TextComponent>
            <CardComponent style={styles.infoCard}>
              <TextComponent>
                {orderDetail.loyaltyTransactionDescription} (
                {orderDetail.pointsEarnedOrSpent} điểm)
              </TextComponent>
            </CardComponent>
            <SpaceComponent size={16} />
          </>
        )}

        {/* Ghi chú */}
        {orderDetail.note && (
          <>
            <TextComponent type="subheading" style={styles.sectionTitle}>
              Ghi chú
            </TextComponent>
            <CardComponent style={styles.infoCard}>
              <TextComponent>{orderDetail.note}</TextComponent>
            </CardComponent>
            <SpaceComponent size={16} />
          </>
        )}

        {/* Tổng cộng */}
        <CardComponent style={styles.totalCard}>
          <RowComponent justifyContent="space-between">
            <TextComponent type="subheading">Tổng cộng</TextComponent>
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
          />
          <ButtonComponent
            title="Đặt lại"
            type="primary"
            onPress={() => router.push("/(tabs)/menu")}
            style={styles.reorderButton}
          />
        </RowComponent>

        <SpaceComponent size={16} />
      </ScrollView>
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.backgroundLight,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    color: Colors.textLightPrimary,
  },
  errorCard: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.error,
    borderWidth: 1,
  },
  headerCard: {
    backgroundColor: Colors.surfaceLight,
    borderColor: Colors.primary,
    borderWidth: 1,
    elevation: 5,
  },
  headerTitle: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: "700",
  },
  infoCard: {
    backgroundColor: Colors.surfaceLight,
    padding: 16,
    borderRadius: 12,
  },
  orderItemCard: {
    backgroundColor: Colors.garlicCream,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    elevation: 3,
  },
  totalCard: {
    backgroundColor: Colors.mozzarella,
    padding: 8,
    borderRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  totalGradient: {
    padding: 16,
  },
  sectionTitle: {
    color: Colors.textLightPrimary,
    marginBottom: 8,
    marginLeft: 8,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    color: Colors.textLightPrimary,
    fontWeight: "600",
  },
  itemDescription: {
    color: Colors.textLightSecondary,
    marginVertical: 4,
    lineHeight: 16,
  },
  itemPrice: {
    color: Colors.textLightSecondary,
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
  },
  totalPrice: {
    color: Colors.pepperoni,
    fontWeight: "700",
  },
  progressBar: {
    marginVertical: 8,
  },
  trackingText: {
    marginTop: 4,
    color: Colors.textLightSecondary,
  },
  backButton: {
    flex: 1,
    marginRight: 8,
    borderColor: Colors.crust,
  },
  reorderButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: Colors.buttonPrimary,
  },
  contactButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  viewItemButton: {
    marginTop: 8,
    paddingVertical: 4,
  },
  viewItemButtonText: {
    color: Colors.buttonAccent,
    fontSize: 12,
  },
});

export default OrderDetailScreen;
