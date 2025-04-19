import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import TextComponent from "@/components/common/TextComponent";
import TagComponent from "@/components/common/TagComponent";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/global.styles";

const getStatusTagType = (status: string): "success" | "warning" | "error" => {
  switch (status) {
    case "Đang xử lý":
      return "warning";
    case "Đã giao":
      return "success";
    case "Đã hủy":
      return "error";
    default:
      return "warning";
  }
};

interface OrderItemProps {
  order: IOrderSummary;
  setOrders: React.Dispatch<React.SetStateAction<IOrderSummary[]>>;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedOrderId: React.Dispatch<React.SetStateAction<number | null>>;
  onPress: (orderId: number) => void;
}

const OrderItem: React.FC<OrderItemProps> = ({
  order,
  setOrders,
  setModalVisible,
  setSelectedOrderId,
  onPress,
}) => {
  const handleCancel = () => {
    setSelectedOrderId(order.id);
    setModalVisible(true);
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(order.id)}
      style={[
        globalStyles.card,
        styles.orderItemContainer,
        {
          backgroundColor: Colors.backgroundLight,
          borderColor: Colors.borderLight,
        },
      ]}
    >
      <TextComponent type="subheading" style={styles.orderCode}>
        Mã đơn hàng: {order.orderCode}
      </TextComponent>
      <TagComponent
        text={order.orderStatus}
        type={getStatusTagType(order.orderStatus)}
        style={styles.statusTag}
        textStyle={styles.statusTagText}
      />
      <TextComponent type="caption" style={styles.orderDate}>
        Đặt ngày: {order.createdAt}
      </TextComponent>
      <TextComponent type="caption" style={styles.orderBranch}>
        Chi nhánh: {order.branchName}
      </TextComponent>
      <TextComponent type="caption" style={styles.orderUser}>
        Khách hàng: {order.userInfo.fullName} ({order.userInfo.phone})
      </TextComponent>
      <TextComponent type="subheading" style={styles.orderTotal}>
        Tổng cộng: {order.totalPrice.toLocaleString("vi-VN")} VNĐ
      </TextComponent>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  orderItemContainer: {
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    position: "relative",
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
