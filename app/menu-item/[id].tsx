import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import ContainerComponent from "@/components/common/ContainerComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import TextComponent from "@/components/common/TextComponent";
import ButtonComponent from "@/components/common/ButtonComponent";
import ToastComponent from "@/components/common/ToastComponent";
import ImageComponent from "@/components/common/ImageComponent";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { defaultOptions } from "@/data/optionData";
import { sampleMenuItems } from "@/data/menuItemsData";
import { useAppDispatch } from "@/store/store";
import { addToCart } from "@/store/slices/cartSlice";

// Interfaces
interface IMenuItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  basePrice: number;
}

interface IOptionValue {
  id: number;
  value: string;
  additionalPrice: number;
}

interface IOption {
  id: number;
  name: string;
  description: string;
  IOptionValues: IOptionValue[];
}

interface ICartItem {
  id: number;
  quantity: number;
  priceAtAddition: number;
  menuItem: IMenuItem;
  options: IOptionValue[];
}

const MenuItemDetail = () => {
  console.log("MenuItemDetail rendered");
  const { isDarkMode } = useTheme();
  const { id } = useLocalSearchParams();
  const item = sampleMenuItems.find((item) => item.id === Number(id));
  const dispatch = useAppDispatch();

  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: IOptionValue;
  }>({});
  const [quantity, setQuantity] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  if (!item) {
    return (
      <ContainerComponent>
        <TextComponent type="subheading" style={styles.errorText}>
          Không tìm thấy sản phẩm.
        </TextComponent>
      </ContainerComponent>
    );
  }

  const calculateTotalPrice = () => {
    const optionsPrice = Object.values(selectedOptions).reduce(
      (sum, option) => sum + option.additionalPrice,
      0
    );
    return (item.basePrice + optionsPrice) * quantity;
  };

  const handleOptionSelect = (optionId: number, value: IOptionValue) => {
    setSelectedOptions((prev) => ({ ...prev, [optionId]: value }));
  };

  const handleAddToCart = () => {
    const options = defaultOptions;
    const missingSelection = options.some(
      (option) => !selectedOptions[option.id]
    );
    if (missingSelection) {
      setToastMessage("Vui lòng chọn tất cả các tùy chọn bắt buộc.");
      setToastType("error");
      setToastVisible(true);
      return;
    }
    const cartItem: ICartItem = {
      id: Date.now(),
      quantity,
      priceAtAddition: calculateTotalPrice() / quantity,
      menuItem: item,
      options: Object.values(selectedOptions),
    };
    dispatch(addToCart(cartItem));
    setToastMessage(`${item.name} đã được thêm vào giỏ hàng!`);
    setToastType("success");
    setToastVisible(true);
  };

  const handleToastHide = () => {
    setToastVisible(false);
    setToastMessage("");
    setToastType("success");
  };

  return (
    <ContainerComponent scrollable>
      <ScrollView>
        <ImageComponent
          source={{ uri: item.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <SpaceComponent size={16} />
        <TextComponent type="heading" style={styles.title}>
          {item.name}
        </TextComponent>
        <TextComponent type="body" style={styles.description}>
          {item.description}
        </TextComponent>
        <SpaceComponent size={8} />
        <TextComponent type="subheading" style={styles.price}>
          {item.basePrice.toLocaleString("vi-VN")} VNĐ
        </TextComponent>
        <SpaceComponent size={24} />

        {/* Hiển thị các tùy chọn */}
        {defaultOptions.map((option) => (
          <View key={option.id} style={styles.optionContainer}>
            <TextComponent type="subheading" style={styles.optionName}>
              {option.name} (Bắt buộc)
            </TextComponent>
            <TextComponent type="body" style={styles.optionDescription}>
              {option.description}
            </TextComponent>
            <SpaceComponent size={8} />
            {option.IOptionValues.map((value) => (
              <TouchableOpacity
                key={value.id}
                style={[
                  styles.optionButton,
                  selectedOptions[option.id]?.id === value.id &&
                    styles.selectedOption,
                  {
                    borderColor: isDarkMode
                      ? Colors.borderDark
                      : Colors.borderLight,
                  },
                ]}
                onPress={() => handleOptionSelect(option.id, value)}
              >
                <View style={styles.optionContent}>
                  <TextComponent
                    style={[
                      styles.optionText,
                      {
                        color: isDarkMode
                          ? selectedOptions[option.id]?.id === value.id
                            ? Colors.buttonTextPrimary
                            : Colors.textDarkPrimary
                          : selectedOptions[option.id]?.id === value.id
                          ? Colors.buttonTextPrimary
                          : Colors.textLightPrimary,
                      },
                    ]}
                  >
                    {value.value}{" "}
                    {value.additionalPrice > 0
                      ? `(+${value.additionalPrice.toLocaleString()} VNĐ)`
                      : ""}
                  </TextComponent>
                  {selectedOptions[option.id]?.id === value.id && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color={Colors.buttonTextPrimary}
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        <SpaceComponent size={16} />

        {/* Bộ chọn số lượng */}
        <View style={styles.quantityContainer}>
          <TextComponent type="subheading" style={styles.quantityLabel}>
            Số lượng:
          </TextComponent>
          <TouchableOpacity
            style={[
              styles.quantityButton,
              {
                borderColor: isDarkMode
                  ? Colors.borderDark
                  : Colors.borderLight,
              },
            ]}
            onPress={() => setQuantity((prev) => Math.max(1, prev - 1))}
          >
            <TextComponent style={styles.quantityButtonText}>-</TextComponent>
          </TouchableOpacity>
          <TextComponent style={styles.quantityText}>{quantity}</TextComponent>
          <TouchableOpacity
            style={[
              styles.quantityButton,
              {
                borderColor: isDarkMode
                  ? Colors.borderDark
                  : Colors.borderLight,
              },
            ]}
            onPress={() => setQuantity((prev) => prev + 1)}
          >
            <TextComponent style={styles.quantityButtonText}>+</TextComponent>
          </TouchableOpacity>
        </View>
        <SpaceComponent size={16} />

        {/* Giá tổng */}
        <TextComponent type="subheading" style={styles.totalPrice}>
          Tổng cộng: {calculateTotalPrice().toLocaleString("vi-VN")} VNĐ
        </TextComponent>
        <SpaceComponent size={24} />

        {/* Nút thêm vào giỏ hàng */}
        <ButtonComponent
          title="Thêm vào giỏ hàng"
          type="primary"
          onPress={handleAddToCart}
          style={styles.addButton}
        />
        <SpaceComponent size={24} />
      </ScrollView>
      <Modal
        animationType="none"
        transparent={true}
        visible={toastVisible}
        onRequestClose={handleToastHide}
      >
        <View style={styles.toastModalContainer}>
          <ToastComponent
            message={toastMessage}
            type={toastType}
            visible={toastVisible}
            onHide={handleToastHide}
            duration={1200}
          />
        </View>
      </Modal>
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  title: {
    color: Colors.textLightPrimary,
    marginHorizontal: 16,
  },
  description: {
    color: Colors.textLightSecondary,
    marginHorizontal: 16,
    lineHeight: 20,
  },
  price: {
    color: Colors.accent,
    marginHorizontal: 16,
  },
  optionContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  optionName: {
    color: Colors.textLightPrimary,
  },
  optionDescription: {
    color: Colors.textLightSecondary,
    marginTop: 4,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 8,
    backgroundColor: Colors.white,
  },
  selectedOption: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "500",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 16,
  },
  quantityLabel: {
    color: Colors.textLightPrimary,
    marginRight: 12,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.textLightPrimary,
  },
  quantityText: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.accent,
  },
  totalPrice: {
    color: Colors.accent,
    marginHorizontal: 16,
    textAlign: "right",
  },
  addButton: {
    marginHorizontal: 16,
    borderRadius: 12,
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    color: Colors.textLightSecondary,
  },
  toastModalContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
});

export default MenuItemDetail;
