// components/cart/EmptyCartComponent.tsx
import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import TextComponent from "@/components/common/TextComponent";
import ButtonComponent from "@/components/common/ButtonComponent";
import RowComponent from "@/components/common/RowComponent";
import LoadingComponent from "@/components/common/LoadingComponent";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAppDispatch } from "@/store/store";
import { fetchCart } from "@/store/slices/cartSlice";

interface EmptyCartProps {
  status: "loading" | "failed" | "empty";
  error?: string | null;
  style?: StyleProp<ViewStyle>;
  dispatch: ReturnType<typeof useAppDispatch>;
}

const EmptyCartComponent: React.FC<EmptyCartProps> = ({
  status,
  error,
  style,
  dispatch,
}) => {
  if (status === "loading") {
    return (
      <LoadingComponent
        loadingText="Đang tải giỏ hàng..."
        style={[styles.emptyContainer, style]}
      />
    );
  }

  const getIconAndText = () => {
    switch (status) {
      case "failed":
        return {
          icon: "alert-circle-outline" as const,
          text: `Lỗi: ${error || "Không thể tải giỏ hàng"}`,
          subText: "Vui lòng thử lại.",
        };
      case "empty":
      default:
        return {
          icon: "cart-outline" as const,
          text: "Giỏ hàng của bạn đang trống",
          subText: "Hãy thêm món ăn từ thực đơn để bắt đầu!",
        };
    }
  };

  const { icon, text, subText } = getIconAndText();

  return (
    <View style={[styles.emptyContainer, style]}>
      <Ionicons name={icon} size={60} color={Colors.accent} />
      <TextComponent type="subheading" style={styles.emptyText}>
        {text}
      </TextComponent>
      {subText && (
        <TextComponent type="body" style={styles.emptySubText}>
          {subText}
        </TextComponent>
      )}
      {status === "empty" && (
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
      )}
      {status === "failed" && (
        <ButtonComponent
          title="Thử lại"
          type="primary"
          onPress={() => dispatch(fetchCart())}
          style={styles.exploreButton}
          accessibilityLabel="Thử lại tải giỏ hàng"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default EmptyCartComponent;
