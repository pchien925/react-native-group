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
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const QuantityControl: React.FC<QuantityControlProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  style,
  disabled = false,
}) => {
  const { isDarkMode } = useTheme();
  const cartStatus = useSelector((state: RootState) => state.cart.status);
  const isDisabled = disabled || cartStatus === "loading";

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
            backgroundColor: isDisabled
              ? Colors.disabled
              : isDarkMode
              ? Colors.surfaceDark
              : Colors.white,
            borderColor: isDarkMode ? Colors.borderDark : Colors.borderLight,
            opacity: pressed && !isDisabled ? 0.7 : 1,
          },
        ]}
        onPress={onDecrease}
        disabled={isDisabled}
        accessibilityLabel="Giảm số lượng"
        accessibilityRole="button"
      >
        <TextComponent
          style={[
            globalStyles.quantityButtonText,
            {
              color: isDisabled
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
            backgroundColor: isDisabled
              ? Colors.disabled
              : isDarkMode
              ? Colors.surfaceDark
              : Colors.white,
            borderColor: isDarkMode ? Colors.borderDark : Colors.borderLight,
            opacity: pressed && !isDisabled ? 0.7 : 1,
          },
        ]}
        onPress={onIncrease}
        disabled={isDisabled}
        accessibilityLabel="Tăng số lượng"
        accessibilityRole="button"
      >
        <TextComponent
          style={[
            globalStyles.quantityButtonText,
            {
              color: isDisabled
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

export default React.memo(QuantityControl);
