import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import ContainerComponent from "@/components/common/ContainerComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import TextComponent from "@/components/common/TextComponent";
import ButtonComponent from "@/components/common/ButtonComponent";
import RowComponent from "@/components/common/RowComponent";
import ToastComponent from "@/components/common/ToastComponent";
import LoadingComponent from "@/components/common/LoadingComponent";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { router } from "expo-router";
import { sampleOrders } from "@/data/orderSummaryData";
import OrderItem from "@/components/order/OrderItemComponent";

const ITEMS_PER_PAGE = 10;

// Ánh xạ orderStatus sang tiếng Việt cho bộ lọc
const statusFilterMap: Record<string, IOrderSummary["orderStatus"] | "Tất cả"> =
  {
    "Tất cả": "Tất cả",
    "Đang giao": "SHIPPING",
    "Đang xử lý": "PROCESSING",
    "Đã giao": "COMPLETED",
    "Đã hủy": "CANCELED",
  };

const OrderScreen = () => {
  const { isDarkMode } = useTheme();
  const [orders, setOrders] = useState<IOrderSummary[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<IOrderSummary[]>([]);
  const [status, setStatus] = useState<
    "idle" | "loading" | "succeeded" | "failed"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("Tất cả");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
    visible: boolean;
  }>({
    message: "",
    type: "success",
    visible: false,
  });

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
  const filterOptions = [
    "Tất cả",
    "Đang giao",
    "Đang xử lý",
    "Đã giao",
    "Đã hủy",
  ];

  // Memoize hàm xử lý
  const handleOrderPress = useCallback((orderId: number) => {
    router.push(`/order/${orderId}`);
  }, []);

  const handleFilterPress = useCallback((filter: string) => {
    setSelectedFilter(filter);
    setPage(1); // Reset page khi đổi filter
    setOrders([]); // Reset orders để tải lại dữ liệu
    setHasMore(true); // Reset hasMore
    setStatus("idle"); // Kích hoạt tải lại
  }, []);

  // Hàm tải dữ liệu
  const loadOrders = useCallback(async (pageNum: number, isRefresh = false) => {
    if (pageNum === 1) {
      setStatus("loading");
      if (isRefresh) setRefreshing(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      await delay(1000); // Độ trễ giả lập
      const start = (pageNum - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      const newOrders = sampleOrders.slice(start, end);

      if (newOrders.length === 0) {
        setHasMore(false);
      } else {
        setOrders((prev) =>
          pageNum === 1 ? newOrders : [...prev, ...newOrders]
        );
      }
      setStatus("succeeded");
    } catch (err) {
      setError("Lỗi tải đơn hàng");
      setStatus("failed");
    } finally {
      setIsLoadingMore(false);
      if (isRefresh) setRefreshing(false);
    }
  }, []);

  // Tải dữ liệu ban đầu hoặc khi trạng thái là idle
  useEffect(() => {
    if (status === "idle") {
      loadOrders(1);
    }
  }, [status, loadOrders]);

  // Lọc dữ liệu khi filter hoặc orders thay đổi
  useEffect(() => {
    const filterStatus = statusFilterMap[selectedFilter];
    if (filterStatus === "Tất cả") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter((order) => order.orderStatus === filterStatus)
      );
    }
  }, [selectedFilter, orders]);

  // Xử lý khi cuộn đến cuối danh sách
  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoadingMore && status === "succeeded" && !refreshing) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadOrders(nextPage);
    }
  }, [hasMore, isLoadingMore, status, page, loadOrders, refreshing]);

  // Xử lý Pull-to-Refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1); // Reset page
    setHasMore(true); // Reset hasMore
    setOrders([]); // Reset orders
    loadOrders(1, true); // Gọi trực tiếp loadOrders với isRefresh = true
  }, [loadOrders]);

  const renderFilterButtons = () => (
    <FlatList
      data={filterOptions}
      renderItem={({ item: filter }) => (
        <ButtonComponent
          title={filter}
          type={selectedFilter === filter ? "primary" : "outline"}
          onPress={() => handleFilterPress(filter)}
          style={styles.filterButton}
          textStyle={styles.filterButtonText}
        />
      )}
      keyExtractor={(item) => item}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.filterContainer}
      ListFooterComponent={<SpaceComponent size={16} horizontal />}
    />
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  };

  return (
    <ContainerComponent style={styles.container}>
      <SpaceComponent size={16} />
      {status === "loading" && page === 1 && !refreshing ? (
        <LoadingComponent
          loadingText="Đang tải đơn hàng..."
          size="large"
          style={styles.emptyContainer}
          accessibilityLabel="Đang tải đơn hàng"
        />
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
        <>
          {renderFilterButtons()}
          <SpaceComponent size={16} />
          <FlatList
            data={filteredOrders}
            renderItem={({ item }) => (
              <OrderItem
                order={item}
                setOrders={setOrders}
                onPress={handleOrderPress}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={renderFooter}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="receipt-outline"
                  size={60}
                  color={Colors.accent}
                />
                <TextComponent type="subheading" style={styles.emptyText}>
                  Không có đơn hàng trong trạng thái này
                </TextComponent>
              </View>
            }
          />
        </>
      )}
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
    color: Colors.textLightPrimary,
  },
  emptySubText: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 14,
    color: Colors.textLightSecondary,
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
  toast: {
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    bottom: 20,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterButton: {
    marginRight: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    minWidth: 100,
    maxHeight: 50,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
});

export default OrderScreen;
