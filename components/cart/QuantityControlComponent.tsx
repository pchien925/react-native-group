// components/cart/QuantityControlComponent.tsx
import React from "react";
import { Pressable, View, StyleProp, ViewStyle } from "react-native";
import TextComponent from "../common/TextComponent";
import { globalStyles } from "@/styles/global.styles";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const QuantityControl: React.FC<QuantityControlProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
  style,
  disabled = false,
}) => {
  const { isDarkMode } = useTheme();
  const cartStatus = useSelector((state: RootState) => state.cart.status);
  const isDecreaseDisabled =
    quantity <= 1 || disabled || cartStatus === "loading";
  const isIncreaseDisabled = disabled || cartStatus === "loading";

  const handleDecrease = () => {
    if (quantity === 1 && onRemove) {
      onRemove();
    } else {
      onDecrease();
    }
  };

  return (
    <View
      style={[
        globalStyles.quantityContainer,
        {
          backgroundColor: isDarkMode
            ? Colors.backgroundDark
            : Colors.backgroundLight,
        },
        style,
      ]}
      accessibilityLabel={`Số lượng: ${quantity}`}
      accessibilityRole="adjustable"
    >
      <Pressable
        style={({ pressed }) => [
          globalStyles.quantityButton,
          {
            backgroundColor: isDecreaseDisabled
              ? Colors.disabled
              : isDarkMode
              ? Colors.surfaceDark
              : Colors.white,
            borderColor: isDarkMode ? Colors.borderDark : Colors.borderLight,
            opacity: pressed && !isDecreaseDisabled ? 0.7 : 1,
          },
        ]}
        onPress={handleDecrease}
        disabled={isDecreaseDisabled}
        accessibilityLabel="Giảm số lượng"
        accessibilityRole="button"
      >
        <TextComponent
          style={[
            globalStyles.quantityButtonText,
            {
              color: isDecreaseDisabled
                ? Colors.textLightSecondary
                : isDarkMode
                ? Colors.textDarkPrimary
                : Colors.textLightPrimary,
            },
          ]}
        >
          -
        </TextComponent>
      </Pressable>
      <TextComponent
        type="body"
        style={[
          globalStyles.quantityText,
          {
            color: isDarkMode
              ? Colors.textDarkPrimary
              : Colors.textLightPrimary,
          },
        ]}
      >
        {quantity}
      </TextComponent>
      <Pressable
        style={({ pressed }) => [
          globalStyles.quantityButton,
          {
            backgroundColor: isIncreaseDisabled
              ? Colors.disabled
              : isDarkMode
              ? Colors.surfaceDark
              : Colors.white,
            borderColor: isDarkMode ? Colors.borderDark : Colors.borderLight,
            opacity: pressed && !isIncreaseDisabled ? 0.7 : 1,
          },
        ]}
        onPress={onIncrease}
        disabled={isIncreaseDisabled}
        accessibilityLabel="Tăng số lượng"
        accessibilityRole="button"
      >
        <TextComponent
          style={[
            globalStyles.quantityButtonText,
            {
              color: isIncreaseDisabled
                ? Colors.textLightSecondary
                : isDarkMode
                ? Colors.textDarkPrimary
                : Colors.textLightPrimary,
            },
          ]}
        >
          +
        </TextComponent>
      </Pressable>
    </View>
  );
};

export default QuantityControl;
