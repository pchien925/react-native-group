import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import ContainerComponent from "@/components/common/ContainerComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import TextComponent from "@/components/common/TextComponent";
import ButtonComponent from "@/components/common/ButtonComponent";
import RowComponent from "@/components/common/RowComponent";
import ToastComponent from "@/components/common/ToastComponent";
import ModalComponent from "@/components/common/ModalComponent";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/global.styles";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { router } from "expo-router";
import { sampleOrders } from "@/data/sampleOrderData";
import OrderItem from "@/components/order/OrderItemComponent";

const OrderScreen = () => {
  const { isDarkMode } = useTheme();
  const [orders, setOrders] = useState<IOrderSummary[]>([]);
  const [status, setStatus] = useState<
    "idle" | "loading" | "succeeded" | "failed"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
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
    if (status === "idle") {
      setStatus("loading");
      setTimeout(() => {
        try {
          setOrders(sampleOrders);
          setStatus("succeeded");
        } catch (err) {
          setError("Lỗi tải đơn hàng");
          setStatus("failed");
        }
      }, 500);
    }
  }, [status]);

  const handleOrderPress = (orderId: number) => {
    router.push(`/order/${orderId}`);
  };

  const handleConfirmCancel = () => {
    if (selectedOrderId) {
      setOrders((prevOrders) =>
        prevOrders.map((o) =>
          o.id === selectedOrderId
            ? {
                ...o,
                orderStatus: "Đã hủy",
                updatedAt: new Date().toLocaleString("vi-VN"),
              }
            : o
        )
      );
      setToast({
        message: "Đơn hàng đã được hủy",
        type: "success",
        visible: true,
      });
    }
    setModalVisible(false);
    setSelectedOrderId(null);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedOrderId(null);
  };

  return (
    <ContainerComponent style={styles.container}>
      <SpaceComponent size={16} />
      {status === "loading" ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="refresh-circle-outline"
            size={60}
            color={Colors.accent}
          />
          <TextComponent type="subheading" style={styles.emptyText}>
            Đang tải đơn hàng...
          </TextComponent>
        </View>
      ) : status === "failed" ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={60}
            color={Colors.accent}
          />
          <TextComponent type="subheading" style={styles.emptyText}>
            Lỗi: {error}
          </TextComponent>
        </View>
      ) : !orders || orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={60} color={Colors.accent} />
          <TextComponent type="subheading" style={styles.emptyText}>
            Bạn chưa có đơn hàng nào
          </TextComponent>
          <TextComponent type="body" style={styles.emptySubText}>
            Hãy đặt món để bắt đầu!
          </TextComponent>
          <RowComponent style={styles.emptyButtonContainer}>
            <ButtonComponent
              title="Xem thực đơn"
              type="primary"
              onPress={() => router.push("/(tabs)/menu")}
              style={styles.exploreButton}
              accessibilityLabel="Xem thực đơn"
            />
            <ButtonComponent
              title="Khám phá ưu đãi"
              type="outline"
              onPress={() => router.push("/(tabs)/home")}
              style={styles.offerButton}
              accessibilityLabel="Khám phá ưu đãi"
            />
          </RowComponent>
        </View>
      ) : (
        <FlatList
          data={orders}
          renderItem={({ item }) => (
            <OrderItem
              order={item}
              setOrders={setOrders}
              setModalVisible={setModalVisible}
              setSelectedOrderId={setSelectedOrderId}
              onPress={handleOrderPress}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<SpaceComponent size={16} />}
          getItemLayout={(data, index) => ({
            length: 150,
            offset: 150 * index,
            index,
          })}
        />
      )}
      <ModalComponent
        visible={modalVisible}
        title="Hủy đơn hàng"
        onClose={handleCloseModal}
        style={styles.modalContent}
        titleStyle={styles.modalTitle}
      >
        <TextComponent style={styles.modalMessage}>
          Bạn có chắc muốn hủy đơn hàng này?
        </TextComponent>
        <RowComponent style={styles.modalButtonContainer}>
          <ButtonComponent
            title="Không"
            type="outline"
            onPress={handleCloseModal}
            style={styles.modalButton}
          />
          <ButtonComponent
            title="Hủy"
            type="primary"
            onPress={handleConfirmCancel}
            style={styles.modalButton}
          />
        </RowComponent>
      </ModalComponent>
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
    padding: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
    marginHorizontal: 16,
    padding: 16,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubText: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
  },
  emptyButtonContainer: {
    marginTop: 16,
    gap: 8,
  },
  exploreButton: {
    width: 140,
    paddingVertical: 10,
    borderRadius: 8,
  },
  offerButton: {
    width: 140,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalContent: {
    borderRadius: 12,
    padding: 16,
    width: "80%",
    maxHeight: "50%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtonContainer: {
    gap: 12,
    justifyContent: "flex-end",
  },
  modalButton: {
    width: 120,
    paddingVertical: 10,
    borderRadius: 8,
  },
  toast: {
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    bottom: 20,
  },
});

export default OrderScreen;
