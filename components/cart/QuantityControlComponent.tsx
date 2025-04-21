import React from "react";
import { Pressable, View, StyleProp, ViewStyle } from "react-native";
import TextComponent from "../common/TextComponent";
import { globalStyles } from "@/styles/global.styles";
import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeContext";

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove?: () => void; // Callback khi giảm từ 1 xuống 0
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
  const isDecreaseDisabled = quantity <= 1 || disabled;

  const handleDecrease = () => {
    if (quantity === 1 && onRemove) {
      onRemove(); // Gọi onRemove thay vì onDecrease khi quantity là 1
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
        disabled={disabled}
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
            backgroundColor: disabled
              ? Colors.disabled
              : isDarkMode
              ? Colors.surfaceDark
              : Colors.white,
            borderColor: isDarkMode ? Colors.borderDark : Colors.borderLight,
            opacity: pressed && !disabled ? 0.7 : 1,
          },
        ]}
        onPress={onIncrease}
        disabled={disabled}
        accessibilityLabel="Tăng số lượng"
        accessibilityRole="button"
      >
        <TextComponent
          style={[
            globalStyles.quantityButtonText,
            {
              color: disabled
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
