import React, { useEffect, useState, useCallback } from "react";
import { FlatList, StyleSheet, View, Linking } from "react-native";
import ContainerComponent from "@/components/common/ContainerComponent";
import TextComponent from "@/components/common/TextComponent";
import CardComponent from "@/components/common/CardComponent";
import RowComponent from "@/components/common/RowComponent";
import ButtonComponent from "@/components/common/ButtonComponent";
import LoadingComponent from "@/components/common/LoadingComponent";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { RefreshControl } from "react-native";
import { getAllBranchesApi } from "@/services/api";
import TagComponent from "@/components/common/TagComponent";
import Toast from "react-native-toast-message";

const BranchScreen: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [branches, setBranches] = useState<IBranch[]>([]);
  const [status, setStatus] = useState<
    "idle" | "loading" | "succeeded" | "failed"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Lấy danh sách chi nhánh từ API
  useEffect(() => {
    if (status === "idle") {
      setStatus("loading");
      const fetchBranches = async () => {
        try {
          const response = await getAllBranchesApi();
          console.log("Branches response:", JSON.stringify(response, null, 2));
          if (response.error || !response.data) {
            throw new Error(
              typeof response.error === "string"
                ? response.error
                : Array.isArray(response.error)
                ? response.error.join(", ")
                : response.message || "Failed to fetch branches"
            );
          }
          setBranches(response.data); // response.data is IBranch[]
          setStatus("succeeded");
        } catch (error: any) {
          console.error("Fetch branches error:", error.message);
          setError(error.message || "Lỗi tải danh sách chi nhánh");
          setStatus("failed");
          Toast.show({
            type: "error",
            text1: error.message || "Lỗi tải danh sách chi nhánh",
            visibilityTime: 3000,
          });
        }
      };
      fetchBranches();
    }
  }, [status]);

  // Xử lý làm mới danh sách
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setBranches([]);
    setStatus("idle");
    setRefreshing(false);
  }, []);

  // Render từng chi nhánh
  const renderBranchItem = useCallback(
    ({ item }: { item: IBranch }) => (
      <CardComponent
        style={[
          styles.branchCard,
          {
            backgroundColor: isDarkMode ? Colors.crust : Colors.garlicCream,
            borderColor: isDarkMode ? Colors.borderDark : Colors.mushroom,
          },
        ]}
      >
        <RowComponent justifyContent="space-between">
          <TextComponent
            type="subheading"
            style={[
              styles.branchName,
              {
                color: isDarkMode
                  ? Colors.textDarkPrimary
                  : Colors.textLightPrimary,
              },
            ]}
          >
            {item.name}
          </TextComponent>
          <TagComponent
            text={item.active ? "Hoạt động" : "Ngừng hoạt động"}
            type={item.active ? "success" : "error"}
          />
        </RowComponent>
        <TextComponent
          type="caption"
          style={[
            styles.branchDetail,
            {
              color: isDarkMode
                ? Colors.textDarkSecondary
                : Colors.textLightSecondary,
            },
          ]}
        >
          Địa chỉ: {item.address}
        </TextComponent>
        <TextComponent
          type="caption"
          style={[
            styles.branchDetail,
            {
              color: isDarkMode
                ? Colors.textDarkSecondary
                : Colors.textLightSecondary,
            },
          ]}
        >
          Số điện thoại: {item.phone}
        </TextComponent>
        <TextComponent
          type="caption"
          style={[
            styles.branchDetail,
            {
              color: isDarkMode
                ? Colors.textDarkSecondary
                : Colors.textLightSecondary,
            },
          ]}
        >
          Giờ mở cửa: {item.operatingHours}
        </TextComponent>
        <RowComponent justifyContent="flex-end">
          <ButtonComponent
            title="Liên hệ"
            type="outline"
            onPress={() => Linking.openURL(`tel:${item.phone}`)}
            style={[
              styles.contactButton,
              {
                borderColor: isDarkMode ? Colors.borderDark : Colors.crust,
              },
            ]}
            textStyle={[
              styles.contactButtonText,
              {
                color: isDarkMode
                  ? Colors.buttonTertiary
                  : Colors.buttonTertiary,
              },
            ]}
          />
        </RowComponent>
      </CardComponent>
    ),
    [isDarkMode]
  );

  // Loading state
  if (status === "loading" && branches.length === 0) {
    return (
      <ContainerComponent style={styles.container}>
        <LoadingComponent
          loadingText="Đang tải danh sách chi nhánh..."
          style={styles.loadingContainer}
        />
      </ContainerComponent>
    );
  }

  // Error state
  if (status === "failed") {
    return (
      <ContainerComponent style={styles.container}>
        <CardComponent
          title="Lỗi"
          content={error || "Không thể tải danh sách chi nhánh"}
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
      </ContainerComponent>
    );
  }

  return (
    <ContainerComponent style={styles.container}>
      <FlatList
        data={branches}
        renderItem={renderBranchItem}
        keyExtractor={(item) => `branch-${item.id}`}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          <TextComponent
            style={[
              styles.emptyText,
              {
                color: isDarkMode
                  ? Colors.textDarkSecondary
                  : Colors.textLightSecondary,
              },
            ]}
          >
            Không có chi nhánh nào.
          </TextComponent>
        }
      />
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  branchCard: {
    borderWidth: 1,
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    elevation: 3,
  },
  branchName: {
    fontWeight: "700",
    fontSize: 16,
  },
  branchDetail: {
    marginVertical: 4,
    fontSize: 12,
  },
  contactButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  contactButtonText: {
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
    padding: 20,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
  errorCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
});

export default BranchScreen;
