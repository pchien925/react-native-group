import React, { useState, useMemo, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { appColors } from "@/src/constants/appColors";
import AntDesign from "@expo/vector-icons/AntDesign";
import { getMenuItemOptionTypesApi } from "@/src/services/api";

interface ProductModalProps {
  visible: boolean;
  product: IMenuItem | null;
  onClose: () => void;
  onAddToCart?: (
    productId: number,
    selectedOptions?: { [key: string]: string }
  ) => void;
}

const ProductModalComponent = ({
  visible,
  product,
  onClose,
  onAddToCart,
}: ProductModalProps) => {
  const [optionTypes, setOptionTypes] = useState<IOptionType[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state và fetch optionTypes khi modal mở hoặc product thay đổi
  useEffect(() => {
    if (!visible || !product) {
      setOptionTypes([]);
      setSelectedOptions({});
      setError(null);
      setLoading(false);
      return;
    }

    const fetchOptionTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getMenuItemOptionTypesApi(product.id);
        if (res.status === 200 && res.data) {
          setOptionTypes(res.data);
        } else {
          setError(res.message || "Không thể tải tùy chọn");
        }
      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi khi tải tùy chọn");
      } finally {
        setLoading(false);
      }
    };

    fetchOptionTypes();
  }, [visible, product]);

  const handleOptionSelect = (optionTypeName: string, optionValue: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionTypeName]: optionValue,
    }));
  };

  const handleAddToCart = () => {
    if (onAddToCart && product) {
      onAddToCart(product.id, selectedOptions);
      onClose();
    }
  };

  const totalPrice = useMemo(() => {
    if (!product) return 0;
    let total = product.basePrice;

    optionTypes.forEach((optionType) => {
      const selectedValue = selectedOptions[optionType.name];
      if (selectedValue) {
        const selectedOptionValue = optionType.optionValues.find(
          (value) => value.name === selectedValue
        );
        if (selectedOptionValue) {
          total += selectedOptionValue.extraCost;
        }
      }
    });

    return total;
  }, [product, optionTypes, selectedOptions]);

  const isAddDisabled = useMemo(() => {
    return optionTypes.some(
      (optionType) =>
        optionType.optionValues.length > 0 && !selectedOptions[optionType.name]
    );
  }, [optionTypes, selectedOptions]);

  if (!product || !visible) return null;

  if (loading) {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.loadingText}>Đang tải...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  if (error) {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
            <AntDesign
              name="close"
              size={24}
              color={appColors.gray || "#666"}
            />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Image
              source={{ uri: product.imageUrl }}
              style={styles.modalImage}
              resizeMode="cover"
            />

            <View style={styles.modalContent}>
              <Text style={styles.modalName}>{product.name}</Text>
              <Text style={styles.modalPrice}>
                {Number(product.basePrice).toLocaleString("vi-VN")}đ
              </Text>
              <Text style={styles.modalDescription}>{product.description}</Text>

              {optionTypes.length > 0 && (
                <View style={styles.optionsContainer}>
                  {optionTypes.map((optionType: IOptionType) => (
                    <View key={optionType.id} style={styles.optionSection}>
                      <Text style={styles.optionName}>{optionType.name}</Text>
                      <View style={styles.optionValuesContainer}>
                        {optionType.optionValues.map((optionValue) => (
                          <TouchableOpacity
                            key={optionValue.id}
                            style={[
                              styles.optionButton,
                              selectedOptions[optionType.name] ===
                                optionValue.name && styles.optionButtonSelected,
                            ]}
                            onPress={() =>
                              handleOptionSelect(
                                optionType.name,
                                optionValue.name
                              )
                            }
                            disabled={!optionValue.available}
                          >
                            <Text
                              style={[
                                styles.optionText,
                                selectedOptions[optionType.name] ===
                                  optionValue.name && styles.optionTextSelected,
                                !optionValue.available &&
                                  styles.optionTextDisabled,
                              ]}
                            >
                              {optionValue.name} (
                              {optionValue.extraCost >= 0
                                ? `+${optionValue.extraCost.toLocaleString(
                                    "vi-VN"
                                  )}`
                                : optionValue.extraCost.toLocaleString("vi-VN")}
                              đ)
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.addButton,
                isAddDisabled && styles.addButtonDisabled,
              ]}
              onPress={handleAddToCart}
              disabled={isAddDisabled}
            >
              <Text style={styles.addButtonText}>
                Thêm vào giỏ hàng (+{totalPrice.toLocaleString("vi-VN")}đ)
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: appColors.white || "#fff",
    borderRadius: 10,
    padding: 15,
    maxHeight: "80%",
    position: "relative",
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  modalContent: {
    paddingVertical: 10,
  },
  modalName: {
    fontSize: 20,
    fontWeight: "bold",
    color: appColors.text || "#000",
    marginBottom: 5,
  },
  modalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: appColors.primary || "#007AFF",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 14,
    color: appColors.gray || "#666",
    lineHeight: 20,
  },
  addButton: {
    backgroundColor: appColors.primary || "#007AFF",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    marginTop: 15,
  },
  addButtonDisabled: {
    backgroundColor: appColors.gray || "#666",
    opacity: 0.5,
  },
  addButtonText: {
    color: appColors.white || "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  optionsContainer: {
    marginTop: 15,
  },
  optionSection: {
    marginBottom: 15,
  },
  optionName: {
    fontSize: 16,
    fontWeight: "600",
    color: appColors.text || "#000",
    marginBottom: 5,
  },
  optionValuesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  optionButton: {
    borderWidth: 1,
    borderColor: appColors.gray || "#666",
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  optionButtonSelected: {
    backgroundColor: appColors.primary || "#007AFF",
    borderColor: appColors.primary || "#007AFF",
  },
  optionText: {
    fontSize: 14,
    color: appColors.text || "#000",
  },
  optionTextSelected: {
    color: appColors.white || "#fff",
  },
  optionTextDisabled: {
    color: appColors.gray || "#666",
    opacity: 0.5,
  },
  loadingText: {
    fontSize: 16,
    color: appColors.text || "#000",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: appColors.primary || "#007AFF",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  closeButtonText: {
    color: appColors.white || "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProductModalComponent;
