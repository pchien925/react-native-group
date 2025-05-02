import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import TextComponent from "@/components/common/TextComponent";
import TagComponent from "@/components/common/TagComponent";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/global.styles";
import { useTheme } from "@/contexts/ThemeContext";

// Map trạng thái đơn hàng
const statusMap: Record<
  IOrderInfo["orderStatus"],
  { text: string; type: "success" | "warning" | "error" | "info" }
> = {
  PROCESSING: { text: "Đang xử lý", type: "warning" },
  SHIPPING: { text: "Đang giao", type: "info" },
  COMPLETED: { text: "Đã giao", type: "success" },
  CANCELLED: { text: "Đã hủy", type: "error" },
};

interface OrderItemProps {
  order: IOrderInfo;
  onPress: (orderId: number) => void;
}

const OrderItem: React.FC<OrderItemProps> = ({ order, onPress }) => {
  const { isDarkMode } = useTheme();
  const colors = {
    bg: isDarkMode ? Colors.backgroundDark : Colors.backgroundLight,
    border: isDarkMode ? Colors.borderDark : Colors.borderLight,
    textPrimary: isDarkMode ? Colors.textDarkPrimary : Colors.textLightPrimary,
    textSecondary: isDarkMode
      ? Colors.textDarkSecondary
      : Colors.textLightSecondary,
  };

  // Format ngày giờ
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  // Format tiền tệ
  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(order.id)}
      style={[
        globalStyles.card,
        styles.container,
        { backgroundColor: colors.bg, borderColor: colors.border },
      ]}
    >
      <TextComponent
        type="subheading"
        style={[styles.code, { color: colors.textPrimary }]}
      >
        Mã: {order.orderCode || "N/A"}
      </TextComponent>
      <TagComponent
        text={statusMap[order.orderStatus]?.text || "Không xác định"}
        type={statusMap[order.orderStatus]?.type || "warning"}
        style={styles.tag}
      />
      <TextComponent
        type="caption"
        style={[styles.text, { color: colors.textSecondary }]}
      >
        Ngày: {formatDate(order.createdAt)}
      </TextComponent>
      <TextComponent
        type="caption"
        style={[styles.text, { color: colors.textSecondary }]}
      >
        Địa chỉ giao: {order.shippingAddress || "N/A"}
      </TextComponent>
      <TextComponent
        type="subheading"
        style={[styles.total, { color: colors.textPrimary }]}
      >
        Tổng: {formatPrice(order.totalPrice)}
      </TextComponent>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 12,
    margin: 8,
    borderWidth: 1,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  code: {
    fontSize: 16,
    fontWeight: "600",
  },
  tag: {
    marginVertical: 4,
    padding: 4,
  },
  text: {
    fontSize: 12,
    marginTop: 4,
  },
  total: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "right",
  },
});

export default OrderItem;
