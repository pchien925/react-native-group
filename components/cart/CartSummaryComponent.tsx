import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import TextComponent from "@/components/common/TextComponent";
import ButtonComponent from "@/components/common/ButtonComponent";
import RowComponent from "@/components/common/RowComponent";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/global.styles";
import { useTheme } from "@/contexts/ThemeContext";

interface CartSummaryProps {
  totalPrice: number;
  onCheckout: () => void;
  style?: StyleProp<ViewStyle>;
}

const CartSummaryComponent: React.FC<CartSummaryProps> = ({
  totalPrice,
  onCheckout,
  style,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <View
      style={[
        globalStyles.card,
        styles.summaryContainer,
        {
          backgroundColor: isDarkMode
            ? Colors.backgroundDark
            : Colors.backgroundLight,
        },
        style,
      ]}
    >
      <RowComponent
        style={styles.totalRow}
        alignItems="center"
        justifyContent="flex-end"
      >
        <TextComponent type="subheading" style={styles.summaryText}>
          Tổng cộng: {totalPrice.toLocaleString("vi-VN")} VNĐ
        </TextComponent>
      </RowComponent>
      <ButtonComponent
        title="Thanh toán"
        type="primary"
        onPress={onCheckout}
        style={styles.checkoutButton}
        disabled={totalPrice <= 0} // Vô hiệu hóa nếu totalPrice không hợp lệ
        accessibilityLabel="Thanh toán giỏ hàng"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  summaryContainer: {
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
  },
  totalRow: {
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: "600",
  },
  checkoutButton: {
    paddingVertical: 12,
    borderRadius: 8,
  },
});

export default CartSummaryComponent;
