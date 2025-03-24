import React, { useState, useMemo, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { appColors } from "@/src/constants/appColors";
import AntDesign from "@expo/vector-icons/AntDesign";
import { getMenuItemOptionTypesApi } from "@/src/services/api";
import SectionComponent from "./SectionComponent";
import ButtonComponent from "./ButtonComponent";
import RowComponent from "./RowComponent";
import { fontFamilies } from "../constants/fontFamilies";

interface ProductModalProps {
  visible: boolean;
  product: IMenuItem | null;
  onClose: () => void;
  onAddToCart?: (
    productId: number,
    selectedOptions?: { [key: string]: string },
    quantity?: number
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
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!visible || !product) {
      setOptionTypes([]);
      setSelectedOptions({});
      setQuantity(1);
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

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleClose = () => {
    if (Object.keys(selectedOptions).length > 0 || quantity > 1) {
      Alert.alert("Xác nhận", "Bạn có chắc muốn đóng mà không lưu thay đổi?", [
        { text: "Hủy", style: "cancel" },
        { text: "Đóng", onPress: onClose },
      ]);
    } else {
      onClose();
    }
  };

  const handleAddToCart = () => {
    if (onAddToCart && product) {
      onAddToCart(product.id, selectedOptions, quantity);
      handleClose();
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
    return total * quantity;
  }, [product, optionTypes, selectedOptions, quantity]);

  const isAddDisabled = useMemo(() => {
    return optionTypes.some(
      (optionType) =>
        optionType.optionValues.length > 0 && !selectedOptions[optionType.name]
    );
  }, [optionTypes, selectedOptions]);

  if (!visible) return null;

  if (!product) {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <SectionComponent styles={styles.errorSection}>
              <Text style={styles.errorText}>Không tìm thấy sản phẩm</Text>
              <ButtonComponent
                text="Đóng"
                type="primary"
                onPress={handleClose}
                textColor={appColors.white}
                textFont={fontFamilies.medium}
              />
            </SectionComponent>
          </View>
        </View>
      </Modal>
    );
  }

  if (loading) {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <SectionComponent>
              <Text style={styles.loadingText}>Đang tải...</Text>
            </SectionComponent>
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
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <SectionComponent styles={styles.errorSection}>
              <Text style={styles.errorText}>{error}</Text>
              <ButtonComponent
                text="Đóng"
                type="primary"
                onPress={handleClose}
                textColor={appColors.white}
                textFont={fontFamilies.medium}
              />
            </SectionComponent>
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
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeIcon} onPress={handleClose}>
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
            <SectionComponent styles={styles.contentSection}>
              <Text style={styles.modalName}>{product.name}</Text>
              <Text style={styles.modalPrice}>
                {Number(product.basePrice).toLocaleString("vi-VN")}đ
              </Text>
              <Text style={styles.modalDescription}>{product.description}</Text>
            </SectionComponent>

            {optionTypes.length > 0 && (
              <SectionComponent styles={styles.optionsContainer}>
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
              </SectionComponent>
            )}

            <SectionComponent styles={styles.quantityContainer}>
              <RowComponent justifyContent="space-between">
                <Text style={styles.quantityLabel}>Số lượng:</Text>
                <RowComponent>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <AntDesign
                      name="minus"
                      size={20}
                      color={appColors.text || "#000"}
                    />
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantityChange(1)}
                  >
                    <AntDesign
                      name="plus"
                      size={20}
                      color={appColors.text || "#000"}
                    />
                  </TouchableOpacity>
                </RowComponent>
              </RowComponent>
            </SectionComponent>

            <ButtonComponent
              text={`Thêm vào giỏ hàng (+${totalPrice.toLocaleString(
                "vi-VN"
              )}đ)`}
              type="primary"
              onPress={handleAddToCart}
              disabled={isAddDisabled}
              textColor={appColors.white}
              textFont={fontFamilies.medium}
              styles={[
                styles.addButton,
                isAddDisabled && styles.addButtonDisabled,
              ]}
            />
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
    padding: 2,
    maxHeight: "80%",
    position: "relative",
  },
  closeIcon: {
    position: "absolute",
    top: 5,
    right: 5,
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
  contentSection: {
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  modalName: {
    fontSize: 20,
    fontWeight: "bold",
    color: appColors.text || "#000",
    marginTop: 6,
    marginBottom: 4,
  },
  modalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: appColors.primary || "#007AFF",
    marginBottom: 6,
  },
  modalDescription: {
    fontSize: 14,
    color: appColors.gray || "#666",
    lineHeight: 20,
  },
  addButton: {
    marginTop: 10,
  },
  addButtonDisabled: {
    backgroundColor: appColors.gray || "#666",
    opacity: 0.5,
  },
  optionsContainer: {
    paddingHorizontal: 14,
    marginTop: 8,
  },
  optionSection: {
    marginBottom: 10,
  },
  optionName: {
    fontSize: 16,
    fontWeight: "600",
    color: appColors.text || "#000",
    marginBottom: 6,
  },
  optionValuesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  optionButton: {
    borderWidth: 1,
    borderColor: appColors.gray || "#666",
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 6,
    marginBottom: 6,
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
    marginBottom: 6,
  },
  errorSection: {
    paddingBottom: 8,
  },
  quantityContainer: {
    marginTop: 10,
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: appColors.text || "#000",
  },
  quantityButton: {
    width: 26,
    height: 26,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: appColors.gray || "#666",
    borderRadius: 12,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: appColors.text || "#000",
    marginHorizontal: 12,
  },
});

export default ProductModalComponent;
