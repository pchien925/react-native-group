// components/menu/ItemCustomizationModal.tsx
import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ModalComponent from "@/components/common/ModalComponent";
import TextComponent from "@/components/common/TextComponent";
import ButtonComponent from "@/components/common/ButtonComponent";
import RowComponent from "@/components/common/RowComponent";
import LoadingComponent from "@/components/common/LoadingComponent";
import { Colors } from "@/constants/Colors";

interface OptionSelectorProps {
  option: IOption;
  selectedOptions: { [key: number]: IOptionValue };
  setSelectedOptions: React.Dispatch<
    React.SetStateAction<{ [key: number]: IOptionValue }>
  >;
  isDarkMode: boolean;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({
  option,
  selectedOptions,
  setSelectedOptions,
  isDarkMode,
}) => {
  const handleOptionSelect = (value: IOptionValue) => {
    setSelectedOptions((prev) => ({ ...prev, [option.id]: value }));
  };

  // Kiểm tra menuItemOption
  if (!option.menuItemOption || !Array.isArray(option.menuItemOption)) {
    return (
      <TextComponent style={styles.noOptionsText}>
        Không có tùy chọn khả dụng cho {option.name}.
      </TextComponent>
    );
  }

  return (
    <View style={styles.optionContainer}>
      <TextComponent style={styles.optionName}>{option.name}</TextComponent>
      <TextComponent style={styles.optionDescription}>
        {option.description}
      </TextComponent>
      {option.menuItemOption.map((value) => (
        <TouchableOpacity
          key={value.id}
          style={[
            styles.optionButton,
            selectedOptions[option.id]?.id === value.id &&
              styles.selectedOption,
            {
              borderColor: isDarkMode ? Colors.borderDark : Colors.borderLight,
            },
          ]}
          activeOpacity={0.7}
          onPress={() => handleOptionSelect(value)}
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
  );
};

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  isDarkMode: boolean;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  setQuantity,
  isDarkMode,
}) => {
  return (
    <RowComponent
      justifyContent="flex-start"
      alignItems="center"
      style={styles.quantityContainer}
    >
      <TextComponent style={styles.quantityLabel}>Số lượng:</TextComponent>
      <TouchableOpacity
        style={[
          styles.quantityButton,
          { borderColor: isDarkMode ? Colors.borderDark : Colors.borderLight },
        ]}
        activeOpacity={0.7}
        onPress={() => setQuantity((prev) => Math.max(1, prev - 1))}
      >
        <TextComponent style={styles.quantityButtonText}>-</TextComponent>
      </TouchableOpacity>
      <TextComponent style={styles.quantityText}>{quantity}</TextComponent>
      <TouchableOpacity
        style={[
          styles.quantityButton,
          { borderColor: isDarkMode ? Colors.borderDark : Colors.borderLight },
        ]}
        activeOpacity={0.7}
        onPress={() => setQuantity((prev) => prev + 1)}
      >
        <TextComponent style={styles.quantityButtonText}>+</TextComponent>
      </TouchableOpacity>
    </RowComponent>
  );
};

interface ItemCustomizationModalProps {
  visible: boolean;
  item: IMenuItem | null;
  options: IOption[];
  categoryId: number | null;
  onClose: () => void;
  selectedOptions: { [key: number]: IOptionValue };
  setSelectedOptions: React.Dispatch<
    React.SetStateAction<{ [key: number]: IOptionValue }>
  >;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  onConfirm: () => void;
  isDarkMode: boolean;
  loading: boolean;
}

const ItemCustomizationModal: React.FC<ItemCustomizationModalProps> = ({
  visible,
  item,
  options,
  onClose,
  selectedOptions,
  setSelectedOptions,
  quantity,
  setQuantity,
  onConfirm,
  isDarkMode,
  loading,
}) => {
  const calculateTotalPrice = () => {
    if (!item) return 0;
    const optionsPrice = Object.values(selectedOptions).reduce(
      (sum, option) => sum + option.additionalPrice,
      0
    );
    return (item.basePrice + optionsPrice) * quantity;
  };

  if (!item) return null;

  return (
    <ModalComponent
      visible={visible}
      title={item.name}
      onClose={onClose}
      style={styles.modalContent}
      titleStyle={styles.modalTitle}
    >
      {loading ? (
        <LoadingComponent
          loadingText="Đang tải tùy chọn..."
          style={styles.loadingContainer}
        />
      ) : options.length > 0 ? (
        options.map((option) => (
          <OptionSelector
            key={option.id}
            option={option}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            isDarkMode={isDarkMode}
          />
        ))
      ) : (
        <TextComponent style={styles.noOptionsText}>
          Không có tùy chọn nào cho món này.
        </TextComponent>
      )}
      <QuantitySelector
        quantity={quantity}
        setQuantity={setQuantity}
        isDarkMode={isDarkMode}
      />
      <TextComponent style={styles.totalPrice}>
        Tổng cộng: {calculateTotalPrice().toLocaleString()} VNĐ
      </TextComponent>
      <RowComponent
        justifyContent="space-between"
        style={styles.buttonContainer}
      >
        <ButtonComponent
          title="Hủy"
          onPress={onClose}
          type="outline"
          style={styles.cancelButton}
        />
        <ButtonComponent
          title="Thêm vào giỏ"
          onPress={onConfirm}
          type="primary"
          style={styles.addButton}
          disabled={loading}
        />
      </RowComponent>
    </ModalComponent>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    borderRadius: 16,
    padding: 24,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  optionContainer: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  optionName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: Colors.textLightSecondary,
    marginBottom: 12,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 8,
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
  noOptionsText: {
    fontSize: 16,
    color: Colors.textLightSecondary,
    marginBottom: 16,
  },
  quantityContainer: {
    marginVertical: 20,
    gap: 8,
  },
  quantityLabel: {
    fontSize: 18,
    fontWeight: "700",
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
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
    fontSize: 18,
    fontWeight: "700",
    color: Colors.accent,
    textAlign: "right",
    marginBottom: 20,
  },
  buttonContainer: {
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: Colors.buttonCancel,
    borderColor: Colors.buttonCancel,
  },
  addButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 100,
  },
});

export default ItemCustomizationModal;
