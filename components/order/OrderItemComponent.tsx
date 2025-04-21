// components/order/OrderItemComponent.tsx
import React, { useCallback } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import TextComponent from "@/components/common/TextComponent";
import TagComponent from "@/components/common/TagComponent";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/global.styles";
import { useTheme } from "@/contexts/ThemeContext";

// Ánh xạ orderStatus sang tiếng Việt
const statusDisplayMap: Record<IOrderSummary["orderStatus"], string> = {
  PROCESSING: "Đang xử lý",
  SHIPPING: "Đang giao",
  COMPLETED: "Đã giao",
  CANCELED: "Đã hủy",
};

// Ánh xạ orderStatus sang type của TagComponent
const getStatusTagType = (
  status: IOrderSummary["orderStatus"]
): "success" | "warning" | "error" | "info" => {
  switch (status) {
    case "PROCESSING":
      return "warning";
    case "COMPLETED":
      return "success";
    case "CANCELED":
      return "error";
    case "SHIPPING":
      return "info";
    default:
      return "warning";
  }
};

interface OrderItemProps {
  order: IOrderSummary;
  setOrders: React.Dispatch<React.SetStateAction<IOrderSummary[]>>;
  onPress: (orderId: number) => void;
}

const OrderItem: React.FC<OrderItemProps> = React.memo(
  ({ order, setOrders, onPress }) => {
    const { isDarkMode } = useTheme();

    if (!order) return null; // Phòng trường hợp order undefined

    const handlePress = useCallback(() => {
      onPress(order.id);
    }, [onPress, order.id]);

    return (
      <TouchableOpacity
        onPress={handlePress}
        style={[
          globalStyles.card,
          styles.orderItemContainer,
          {
            backgroundColor: isDarkMode
              ? Colors.backgroundDark
              : Colors.backgroundLight,
            borderColor: isDarkMode ? Colors.borderDark : Colors.borderLight,
            shadowColor: Colors.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
          },
        ]}
      >
        <TextComponent
          type="subheading"
          style={[
            styles.orderCode,
            {
              color: isDarkMode
                ? Colors.textDarkPrimary
                : Colors.textLightPrimary,
            },
          ]}
        >
          Mã đơn hàng: {order.orderCode || "N/A"}
        </TextComponent>
        <TagComponent
          text={statusDisplayMap[order.orderStatus] || order.orderStatus}
          type={getStatusTagType(order.orderStatus)}
          style={styles.statusTag}
          textStyle={styles.statusTagText}
        />
        <TextComponent
          type="caption"
          style={[
            styles.orderDate,
            {
              color: isDarkMode
                ? Colors.textDarkSecondary
                : Colors.textLightSecondary,
            },
          ]}
        >
          Đặt ngày: {new Date(order.createdAt).toLocaleString("vi-VN") || "N/A"}
        </TextComponent>
        <TextComponent
          type="caption"
          style={[
            styles.orderBranch,
            {
              color: isDarkMode
                ? Colors.textDarkSecondary
                : Colors.textLightSecondary,
            },
          ]}
        >
          Chi nhánh: {order.branchName || "N/A"}
        </TextComponent>
        <TextComponent
          type="caption"
          style={[
            styles.orderUser,
            {
              color: isDarkMode
                ? Colors.textDarkSecondary
                : Colors.textLightSecondary,
            },
          ]}
        >
          Khách hàng: {order.userInfo.fullName || "N/A"} (
          {order.userInfo.phone || "N/A"})
        </TextComponent>
        <TextComponent
          type="subheading"
          style={[
            styles.orderTotal,
            {
              color: isDarkMode
                ? Colors.textDarkPrimary
                : Colors.textLightPrimary,
            },
          ]}
        >
          Tổng cộng: {order.totalPrice.toLocaleString("vi-VN")} VNĐ
        </TextComponent>
      </TouchableOpacity>
    );
  },
  (prevProps, nextProps) =>
    prevProps.order.id === nextProps.order.id &&
    prevProps.order.orderStatus === nextProps.order.orderStatus &&
    prevProps.order.totalPrice === nextProps.order.totalPrice
);

const styles = StyleSheet.create({
  orderItemContainer: {
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
  },
  orderCode: {
    fontSize: 16,
    fontWeight: "600",
  },
  statusTag: {
    marginTop: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  statusTagText: {
    fontSize: 12,
  },
  orderDate: {
    fontSize: 12,
    marginTop: 4,
  },
  orderBranch: {
    fontSize: 12,
    marginTop: 4,
  },
  orderUser: {
    fontSize: 12,
    marginTop: 4,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "right",
  },
});

export default OrderItem;
