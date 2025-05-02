import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  ActivityIndicator,
  View,
  Pressable,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ContainerComponent from "@/components/common/ContainerComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import TextComponent from "@/components/common/TextComponent";
import ButtonComponent from "@/components/common/ButtonComponent";
import LoadingComponent from "@/components/common/LoadingComponent";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { router } from "expo-router";
import OrderItem from "@/components/order/OrderItemComponent";
import { getUserOrdersApi } from "@/services/api";
import Toast from "react-native-toast-message"; // Import Toast

const ITEMS_PER_PAGE = 10;

// Map order status to Vietnamese for filters
const statusFilterMap: Record<string, IOrderInfo["orderStatus"] | "Tất cả"> = {
  "Tất cả": "Tất cả",
  "Đang giao": "SHIPPING",
  "Đang xử lý": "PROCESSING",
  "Đã giao": "COMPLETED",
  "Đã hủy": "CANCELLED",
};

const OrderScreen: React.FC = () => {
  console.log("OrderScreen rendered");
  const { isDarkMode } = useTheme();
  const [orders, setOrders] = useState<IOrderInfo[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<IOrderInfo[]>([]);
  const [status, setStatus] = useState<
    "idle" | "loading" | "succeeded" | "failed"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("Tất cả");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const fadeAnim = useState(new Animated.Value(0))[0]; // Animation for filter buttons

  const filterOptions = [
    "Tất cả",
    "Đang giao",
    "Đang xử lý",
    "Đã giao",
    "Đã hủy",
  ];

  // Fetch user ID from AsyncStorage
  async function fetchUserId() {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const user: IUser = JSON.parse(userData);
        setUserId(user.id);
      } else {
        Toast.show({
          type: "error",
          text1: "Vui lòng đăng nhập để xem đơn hàng",
          visibilityTime: 3000,
        });
        router.replace("/login");
      }
    } catch (error) {
      console.error("Error fetching userId:", error);
      Toast.show({
        type: "error",
        text1: "Không thể lấy thông tin người dùng",
        visibilityTime: 3000,
      });
    }
  }

  // Load orders from API
  async function loadOrders(pageNum: number, isRefresh = false) {
    if (!userId) return;
    if (pageNum === 1) {
      setStatus("loading");
      if (isRefresh) setRefreshing(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const response: IBackendResponse<IPaginationData<IOrderInfo>> =
        await getUserOrdersApi(
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
        throw new Error(response.message || "Không thể tải đơn hàng");
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
      Toast.show({
        type: "error",
        text1: err.message || "Lỗi tải đơn hàng",
        visibilityTime: 3000,
      });
    } finally {
      setIsLoadingMore(false);
      if (isRefresh) setRefreshing(false);
    }
  }

  // Load initial data and fetch user ID
  useEffect(() => {
    fetchUserId();
    if (status === "idle" && userId) {
      loadOrders(1);
    }
  }, [status, userId]);

  // Filter orders based on selected status
  useEffect(() => {
    const filterStatus = statusFilterMap[selectedFilter];
    setFilteredOrders(
      filterStatus === "Tất cả"
        ? orders
        : orders.filter((order) => order.orderStatus === filterStatus)
    );
  }, [selectedFilter, orders]);

  // Animate filter buttons on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  function handleOrderPress(orderId: number) {
    if (userId) {
      router.push(`/order/${orderId}?userId=${userId}`);
    }
  }

  function handleFilterPress(filter: string) {
    setSelectedFilter(filter);
    setPage(1);
    setOrders([]);
    setTotalPages(1);
    setStatus("idle");
  }

  function handleLoadMore() {
    if (
      !isLoadingMore &&
      !refreshing &&
      page < totalPages &&
      status === "succeeded" &&
      filteredOrders.length > 0
    ) {
      setPage((prev) => prev + 1);
      loadOrders(page + 1);
    }
  }

  function onRefresh() {
    setRefreshing(true);
    setPage(1);
    setOrders([]);
    setTotalPages(1);
    loadOrders(1, true);
  }

  // Render filter buttons
  function renderFilterButtons() {
    return (
      <Animated.View style={[styles.filterWrapper, { opacity: fadeAnim }]}>
        <FlatList
          data={filterOptions}
          renderItem={({ item: filter }) => (
            <Pressable
              onPress={() => handleFilterPress(filter)}
              style={({ pressed }) => [
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
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <TextComponent
                type="caption"
                style={[
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
              >
                {filter}
              </TextComponent>
            </Pressable>
          )}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        />
      </Animated.View>
    );
  }

  function renderFooter() {
    return isLoadingMore ? (
      <View style={styles.footerLoader}>
        <ActivityIndicator
          size="small"
          color={isDarkMode ? Colors.accent : Colors.primary}
        />
      </View>
    ) : null;
  }

  function renderEmptyState() {
    return (
      <View style={styles.emptyContainer}>
        <Animated.View
          style={{
            transform: [
              {
                scale: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          }}
        >
          <Ionicons
            name={orders.length === 0 ? "receipt-outline" : "filter-outline"}
            size={60}
            color={isDarkMode ? Colors.accent : Colors.primary}
          />
        </Animated.View>
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
          {orders.length === 0
            ? "Bạn chưa có đơn hàng nào"
            : "Không có đơn hàng trong trạng thái này"}
        </TextComponent>
        {orders.length === 0 && (
          <>
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
            <View style={styles.emptyButtonContainer}>
              <ButtonComponent
                title="Xem thực đơn"
                type="primary"
                onPress={() => router.push("/(tabs)/menu")}
                style={styles.actionButton}
              />
              <ButtonComponent
                title="Khám phá ưu đãi"
                type="outline"
                onPress={() => router.push("/(tabs)/home")}
                style={styles.actionButton}
              />
            </View>
          </>
        )}
      </View>
    );
  }

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
            style={styles.actionButton}
          />
        </View>
      ) : (
        <>
          {renderFilterButtons()}
          <SpaceComponent size={12} />
          <FlatList
            data={filteredOrders}
            renderItem={({ item }) => (
              <OrderItem order={item} onPress={handleOrderPress} />
            )}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={renderFooter}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListEmptyComponent={renderEmptyState}
            contentContainerStyle={styles.listContent}
          />
        </>
      )}
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    paddingTop: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  emptySubText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
  },
  emptyButtonContainer: {
    flexDirection: "row",
    marginTop: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
  },
  filterWrapper: {
    minHeight: 50, // Ensure container has minimum height
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexGrow: 1, // Ensure content takes full width
  },
  filterButton: {
    marginRight: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center", // Center text vertically
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  footerLoader: {
    paddingVertical: 24,
    alignItems: "center",
  },
});

export default OrderScreen;
