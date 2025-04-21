// screens/OrderScreen.tsx
import React, { useState, useEffect, useCallback } from "react";
import { FlatList, StyleSheet, ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import OrderItem from "@/components/order/OrderItemComponent";
import { getUserOrdersApi } from "@/services/api";

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
  const [totalPages, setTotalPages] = useState(1);
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
  const [userId, setUserId] = useState<number | null>(null);

  const filterOptions = [
    "Tất cả",
    "Đang giao",
    "Đang xử lý",
    "Đã giao",
    "Đã hủy",
  ];

  // Lấy userId từ AsyncStorage
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        console.log("User data:", userData);
        if (userData) {
          const user = JSON.parse(userData);
          setUserId(user.id);
        } else {
          setToast({
            message: "Vui lòng đăng nhập để xem đơn hàng",
            type: "error",
            visible: true,
          });
        }
      } catch (error) {
        console.error("Error fetching userId:", error);
        setToast({
          message: "Không thể lấy thông tin người dùng",
          type: "error",
          visible: true,
        });
      }
    };
    fetchUserId();
  }, []);

  // Hàm tải dữ liệu đơn hàng
  const loadOrders = useCallback(
    async (pageNum: number, isRefresh = false) => {
      if (!userId) return;
      if (pageNum === 1) {
        setStatus("loading");
        if (isRefresh) setRefreshing(true);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const response = await getUserOrdersApi(
          userId,
          pageNum,
          ITEMS_PER_PAGE,
          "createdAt",
          "desc"
        );
        if (response.error || !response.data) {
          if (response.error?.includes("Current user not found")) {
            router.replace("/login");
          }
          throw new Error(response.message || "Failed to fetch orders");
        }
        const newOrders = response.data.content;
        setTotalPages(response.data.totalPages);
        setOrders((prev) =>
          pageNum === 1 ? newOrders : [...prev, ...newOrders]
        );
        setStatus("succeeded");
      } catch (err: any) {
        setError(err.message || "Lỗi tải đơn hàng");
        setStatus("failed");
        setToast({
          message: err.message || "Lỗi tải đơn hàng",
          type: "error",
          visible: true,
        });
      } finally {
        setIsLoadingMore(false);
        if (isRefresh) setRefreshing(false);
      }
    },
    [userId]
  );

  // Tải dữ liệu ban đầu hoặc khi trạng thái là idle
  useEffect(() => {
    if (status === "idle" && userId) {
      loadOrders(1);
    }
  }, [status, userId, loadOrders]);

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

  // Memoize hàm xử lý
  const handleOrderPress = useCallback(
    (orderId: number) => {
      if (userId) {
        router.push(`/order/${orderId}?userId=${userId}`);
      }
    },
    [userId]
  );

  const handleFilterPress = useCallback((filter: string) => {
    setSelectedFilter(filter);
    setPage(1);
    setOrders([]);
    setTotalPages(1);
    setStatus("idle");
  }, []);

  // Xử lý khi cuộn đến cuối danh sách
  const handleLoadMore = useCallback(() => {
    if (
      !isLoadingMore &&
      !refreshing &&
      page < totalPages &&
      status === "succeeded"
    ) {
      setIsLoadingMore(true);
      setPage((prev) => prev + 1);
      loadOrders(page + 1);
    }
  }, [isLoadingMore, refreshing, page, totalPages, status, loadOrders]);

  // Xử lý Pull-to-Refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setOrders([]);
    setTotalPages(1);
    loadOrders(1, true);
  }, [loadOrders]);

  const renderFilterButtons = useCallback(
    () => (
      <FlatList
        data={filterOptions}
        renderItem={({ item: filter }) => (
          <ButtonComponent
            title={filter}
            type={selectedFilter === filter ? "primary" : "outline"}
            onPress={() => handleFilterPress(filter)}
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  selectedFilter === filter
                    ? isDarkMode
                      ? Colors.primary
                      : Colors.accent
                    : isDarkMode
                    ? Colors.crust
                    : Colors.backgroundLight,
                borderColor: isDarkMode
                  ? Colors.borderDark
                  : Colors.borderLight,
              },
            ]}
            textStyle={[
              styles.filterButtonText,
              {
                color:
                  selectedFilter === filter
                    ? Colors.white
                    : isDarkMode
                    ? Colors.textDarkPrimary
                    : Colors.textLightPrimary,
              },
            ]}
          />
        )}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
        ListFooterComponent={<SpaceComponent size={16} horizontal />}
      />
    ),
    [selectedFilter, isDarkMode, handleFilterPress]
  );

  const renderFooter = useCallback(
    () =>
      isLoadingMore ? (
        <View style={styles.footerLoader}>
          <ActivityIndicator
            size="small"
            color={isDarkMode ? Colors.accent : Colors.primary}
          />
        </View>
      ) : null,
    [isLoadingMore, isDarkMode]
  );

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
            color={isDarkMode ? Colors.accent : Colors.primary}
          />
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
            Lỗi: {error}
          </TextComponent>
          <ButtonComponent
            title="Thử lại"
            type="primary"
            onPress={() => {
              setStatus("idle");
              setPage(1);
              setOrders([]);
              setTotalPages(1);
            }}
            style={styles.retryButton}
          />
        </View>
      ) : !orders || orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="receipt-outline"
            size={60}
            color={isDarkMode ? Colors.accent : Colors.primary}
          />
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
            Bạn chưa có đơn hàng nào
          </TextComponent>
          <TextComponent
            type="body"
            style={[
              styles.emptySubText,
              {
                color: isDarkMode
                  ? Colors.textDarkSecondary
                  : Colors.textLightSecondary,
              },
            ]}
          >
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
            getItemLayout={(data, index) => ({
              length: 140, // Ước tính chiều cao của OrderItem (có thể điều chỉnh)
              offset: 140 * index,
              index,
            })}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="receipt-outline"
                  size={60}
                  color={isDarkMode ? Colors.accent : Colors.primary}
                />
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
  retryButton: {
    marginTop: 16,
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
    textAlign: "center",
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
});

export default OrderScreen;
