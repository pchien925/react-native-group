// components/cart/CartItemComponent.tsx
import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import ImageComponent from "@/components/common/ImageComponent";
import TextComponent from "@/components/common/TextComponent";
import ModalComponent from "@/components/common/ModalComponent";
import ButtonComponent from "@/components/common/ButtonComponent";
import RowComponent from "@/components/common/RowComponent";
import QuantityControl from "@/components/cart/QuantityControlComponent";
import { Colors } from "@/constants/Colors";
import { globalStyles } from "@/styles/global.styles";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { useAppDispatch } from "@/store/store";
import { updateQuantity, removeFromCart } from "@/store/slices/cartSlice";

interface CartItemProps {
  item: ICartItem;
  style?: StyleProp<ViewStyle>;
}

const CartItemComponent: React.FC<CartItemProps> = ({ item, style }) => {
  const dispatch = useAppDispatch();
  const { isDarkMode } = useTheme();
  const [showConfirm, setShowConfirm] = React.useState(false);

  const handleRemove = () => {
    setShowConfirm(true); // Hiển thị modal xác nhận
  };

  const confirmRemove = () => {
    dispatch(removeFromCart(item.id));
    setShowConfirm(false);
  };

  return (
    <>
      <View
        style={[
          globalStyles.card,
          styles.cartItemContainer,
          {
            backgroundColor: isDarkMode
              ? Colors.backgroundDark
              : Colors.backgroundLight,
            borderColor: isDarkMode ? Colors.borderDark : Colors.borderLight,
          },
          style,
        ]}
      >
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleRemove}
          accessibilityLabel={`Xóa ${item.menuItem.name}`}
          accessibilityRole="button"
        >
          <Ionicons name="close" size={18} color={Colors.accent} />
        </TouchableOpacity>
        <ImageComponent
          source={{ uri: item.menuItem.imageUrl }}
          style={styles.cartItemImage}
        />
        <View style={styles.cartItemDetails}>
          <TextComponent
            type="subheading"
            style={[
              styles.cartItemName,
              {
                color: isDarkMode
                  ? Colors.textDarkPrimary
                  : Colors.textLightPrimary,
              },
            ]}
          >
            {item.menuItem.name}
          </TextComponent>
          {/* Hiển thị options theo chiều dọc */}
          {Array.isArray(item.options) && item.options.length > 0 ? (
            <View style={styles.optionsContainer}>
              {item.options.map((opt) => (
                <TextComponent
                  key={opt.id}
                  type="caption"
                  style={[
                    styles.cartItemOption,
                    {
                      color: isDarkMode
                        ? Colors.textDarkSecondary
                        : Colors.textLightSecondary,
                    },
                  ]}
                >
                  - {opt.value}{" "}
                  {opt.additionalPrice > 0
                    ? `(+${opt.additionalPrice.toLocaleString("vi-VN")} VNĐ)`
                    : ""}
                </TextComponent>
              ))}
            </View>
          ) : (
            <TextComponent
              type="caption"
              style={[
                styles.cartItemOption,
                {
                  color: isDarkMode
                    ? Colors.textDarkSecondary
                    : Colors.textLightSecondary,
                },
              ]}
            >
              Không có tùy chọn
            </TextComponent>
          )}
          <TextComponent
            type="body"
            style={[
              styles.cartItemPrice,
              {
                color: isDarkMode
                  ? Colors.textDarkPrimary
                  : Colors.textLightPrimary,
              },
            ]}
          >
            {(item.priceAtAddition * item.quantity).toLocaleString("vi-VN")} VNĐ
          </TextComponent>
        </View>
        <QuantityControl
          quantity={item.quantity}
          onIncrease={() =>
            dispatch(
              updateQuantity({
                cartItemId: item.id,
                quantity: item.quantity + 1,
              })
            )
          }
          onDecrease={() =>
            dispatch(
              updateQuantity({
                cartItemId: item.id,
                quantity: item.quantity - 1,
              })
            )
          }
          onRemove={handleRemove}
          style={styles.quantityContainer}
        />
      </View>
      <ModalComponent
        visible={showConfirm}
        title="Xác nhận xóa"
        onClose={() => setShowConfirm(false)}
      >
        <TextComponent
          type="body"
          style={{
            color: isDarkMode
              ? Colors.textDarkPrimary
              : Colors.textLightPrimary,
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          Bạn có chắc muốn xóa {item.menuItem.name} khỏi giỏ hàng?
        </TextComponent>
        <RowComponent justifyContent="space-between">
          <ButtonComponent
            title="Hủy"
            type="outline"
            onPress={() => setShowConfirm(false)}
            style={styles.modalButton}
            textStyle={styles.modalButtonText}
            accessibilityLabel="Hủy xóa món"
          />
          <ButtonComponent
            title="Xóa"
            type="primary"
            onPress={confirmRemove}
            style={styles.modalButton}
            textStyle={styles.modalButtonText}
            accessibilityLabel={`Xóa ${item.menuItem.name}`}
          />
        </RowComponent>
      </ModalComponent>
    </>
  );
};

CartItemComponent.displayName = "CartItemComponent";

export default React.memo(CartItemComponent);

const styles = StyleSheet.create({
  cartItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: 4,
    zIndex: 1,
  },
  cartItemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  cartItemDetails: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: "600",
  },
  optionsContainer: {
    marginTop: 6,
    flexDirection: "column", // Hiển thị options theo chiều dọc
  },
  cartItemOption: {
    fontSize: 12,
    marginVertical: 2, // Khoảng cách giữa các dòng option
  },
  cartItemPrice: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
  },
  quantityContainer: {
    position: "absolute",
    bottom: 8,
    right: 8,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 10,
  },
  modalButtonText: {
    fontSize: 14,
  },
});
