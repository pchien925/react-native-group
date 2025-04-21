// screens/MenuItemDetail.tsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { StyleSheet, View, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams } from "expo-router";
import ContainerComponent from "@/components/common/ContainerComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import TextComponent from "@/components/common/TextComponent";
import ButtonComponent from "@/components/common/ButtonComponent";
import ToastComponent from "@/components/common/ToastComponent";
import ImageComponent from "@/components/common/ImageComponent";
import LoadingComponent from "@/components/common/LoadingComponent";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import { useAppDispatch } from "@/store/store";
import { addToCart } from "@/store/slices/cartSlice";
import { getMenuItemByIdApi, getOptionsByMenuItemApi } from "@/services/api";

const MenuItemDetail = () => {
  console.log("MenuItemDetail rendered");
  const { isDarkMode } = useTheme();
  const { id } = useLocalSearchParams();
  const dispatch = useAppDispatch();

  const [item, setItem] = useState<IMenuItem | null>(null);
  const [itemLoading, setItemLoading] = useState(true);
  const [options, setOptions] = useState<IOption[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: IOptionValue;
  }>({});
  const [quantity, setQuantity] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Lấy thông tin món ăn từ API
  useEffect(() => {
    const fetchItem = async () => {
      setItemLoading(true);
      try {
        const response = await getMenuItemByIdApi(Number(id));
        if (response.error || !response.data) {
          throw new Error(response.message || "Failed to fetch item");
        }
        setItem(response.data);
      } catch (error: any) {
        setToastMessage(error.message || "Không thể tải món ăn");
        setToastType("error");
        setToastVisible(true);
        setItem(null);
      } finally {
        setItemLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  // Lấy tùy chọn từ API
  useEffect(() => {
    const fetchOptions = async () => {
      if (!item) return;
      setOptionsLoading(true);
      try {
        const response = await getOptionsByMenuItemApi(item.id);
        if (response.error || !response.data) {
          throw new Error(response.message || "Failed to fetch options");
        }
        const validOptions = response.data.filter(
          (option) =>
            option.menuItemOption && Array.isArray(option.menuItemOption)
        );
        setOptions(validOptions);
      } catch (error: any) {
        setToastMessage(error.message || "Không thể tải tùy chọn món ăn");
        setToastType("error");
        setToastVisible(true);
      } finally {
        setOptionsLoading(false);
      }
    };
    fetchOptions();
  }, [item]);

  const calculateTotalPrice = useCallback(() => {
    if (!item) return 0;
    const optionsPrice = Object.values(selectedOptions).reduce(
      (sum, option) => sum + option.additionalPrice,
      0
    );
    return (item.basePrice + optionsPrice) * quantity;
  }, [item, selectedOptions, quantity]);

  const handleOptionSelect = useCallback(
    (optionId: number, value: IOptionValue) => {
      setSelectedOptions((prev) => ({ ...prev, [optionId]: value }));
    },
    []
  );

  const handleAddToCart = useCallback(() => {
    if (!item) return;
    dispatch(
      addToCart({
        menuItemId: item.id,
        quantity,
        options: Object.values(selectedOptions),
      })
    ).then((action) => {
      if (addToCart.fulfilled.match(action)) {
        setToastMessage(`${item.name} đã được thêm vào giỏ hàng!`);
        setToastType("success");
      } else {
        setToastMessage(
          (action.payload as string) || "Không thể thêm vào giỏ hàng"
        );
        setToastType("error");
      }
      setToastVisible(true);
    });
  }, [dispatch, item, selectedOptions, quantity]);

  const handleToastHide = useCallback(() => {
    setToastVisible(false);
    setToastMessage("");
    setToastType("success");
  }, []);

  const totalPrice = useMemo(
    () => calculateTotalPrice(),
    [calculateTotalPrice]
  );

  // Nội dung render được xác định sau khi gọi tất cả hook
  let content: JSX.Element;

  if (itemLoading) {
    content = (
      <ContainerComponent>
        <LoadingComponent
          loadingText="Đang tải món ăn..."
          style={styles.loadingContainer}
        />
      </ContainerComponent>
    );
  } else if (!item) {
    content = (
      <ContainerComponent>
        <TextComponent
          type="subheading"
          style={[
            styles.errorText,
            {
              color: isDarkMode
                ? Colors.textDarkSecondary
                : Colors.textLightSecondary,
            },
          ]}
        >
          Không tìm thấy sản phẩm.
        </TextComponent>
      </ContainerComponent>
    );
  } else {
    content = (
      <ContainerComponent scrollable>
        <ScrollView>
          <ImageComponent
            source={{ uri: item.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          <SpaceComponent size={16} />
          <TextComponent
            type="heading"
            style={[
              styles.title,
              {
                color: isDarkMode
                  ? Colors.textDarkPrimary
                  : Colors.textLightPrimary,
              },
            ]}
          >
            {item.name}
          </TextComponent>
          <TextComponent
            type="body"
            style={[
              styles.description,
              {
                color: isDarkMode
                  ? Colors.textDarkSecondary
                  : Colors.textLightSecondary,
              },
            ]}
          >
            {item.description}
          </TextComponent>
          <SpaceComponent size={8} />
          <TextComponent
            type="subheading"
            style={[styles.price, { color: Colors.accent }]}
          >
            {item.basePrice.toLocaleString("vi-VN")} VNĐ
          </TextComponent>
          <SpaceComponent size={24} />

          {/* Hiển thị các tùy chọn */}
          {optionsLoading ? (
            <LoadingComponent
              loadingText="Đang tải tùy chọn..."
              style={styles.loadingContainer}
            />
          ) : options.length > 0 ? (
            options.map((option) => (
              <View
                key={option.id}
                style={[
                  styles.optionContainer,
                  {
                    backgroundColor: isDarkMode
                      ? Colors.crust
                      : Colors.backgroundLight,
                    borderColor: isDarkMode
                      ? Colors.borderDark
                      : Colors.borderLight,
                    shadowColor: Colors.black,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 4,
                    elevation: 3,
                  },
                ]}
              >
                <TextComponent
                  type="subheading"
                  style={[
                    styles.optionName,
                    {
                      color: isDarkMode
                        ? Colors.textDarkPrimary
                        : Colors.textLightPrimary,
                    },
                  ]}
                >
                  {option.name}
                </TextComponent>
                <TextComponent
                  type="body"
                  style={[
                    styles.optionDescription,
                    {
                      color: isDarkMode
                        ? Colors.textDarkSecondary
                        : Colors.textLightSecondary,
                    },
                  ]}
                >
                  {option.description}
                </TextComponent>
                <SpaceComponent size={8} />
                {option.menuItemOption.map((value) => (
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
                        backgroundColor: isDarkMode
                          ? Colors.backgroundDark
                          : Colors.white,
                        shadowColor: Colors.black,
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity:
                          selectedOptions[option.id]?.id === value.id
                            ? 0.2
                            : 0.1,
                        shadowRadius:
                          selectedOptions[option.id]?.id === value.id ? 4 : 2,
                        elevation:
                          selectedOptions[option.id]?.id === value.id ? 3 : 2,
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
            ))
          ) : (
            <TextComponent
              type="body"
              style={[
                styles.noOptionsText,
                {
                  color: isDarkMode
                    ? Colors.textDarkSecondary
                    : Colors.textLightSecondary,
                },
              ]}
            >
              Không có tùy chọn nào cho món này.
            </TextComponent>
          )}
          <SpaceComponent size={16} />

          {/* Bộ chọn số lượng */}
          <View style={styles.quantityContainer}>
            <TextComponent
              type="subheading"
              style={[
                styles.quantityLabel,
                {
                  color: isDarkMode
                    ? Colors.textDarkPrimary
                    : Colors.textLightPrimary,
                },
              ]}
            >
              Số lượng:
            </TextComponent>
            <TouchableOpacity
              style={[
                styles.quantityButton,
                {
                  borderColor: isDarkMode
                    ? Colors.borderDark
                    : Colors.borderLight,
                  backgroundColor: isDarkMode
                    ? Colors.crust
                    : Colors.backgroundLight,
                  shadowColor: Colors.black,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                  elevation: 3,
                },
              ]}
              onPress={() => setQuantity((prev) => Math.max(1, prev - 1))}
            >
              <TextComponent
                style={[
                  styles.quantityButtonText,
                  {
                    color: isDarkMode
                      ? Colors.textDarkPrimary
                      : Colors.textLightPrimary,
                  },
                ]}
              >
                -
              </TextComponent>
            </TouchableOpacity>
            <TextComponent
              style={[styles.quantityText, { color: Colors.accent }]}
            >
              {quantity}
            </TextComponent>
            <TouchableOpacity
              style={[
                styles.quantityButton,
                {
                  borderColor: isDarkMode
                    ? Colors.borderDark
                    : Colors.borderLight,
                  backgroundColor: isDarkMode
                    ? Colors.crust
                    : Colors.backgroundLight,
                  shadowColor: Colors.black,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                  elevation: 3,
                },
              ]}
              onPress={() => setQuantity((prev) => prev + 1)}
            >
              <TextComponent
                style={[
                  styles.quantityButtonText,
                  {
                    color: isDarkMode
                      ? Colors.textDarkPrimary
                      : Colors.textLightPrimary,
                  },
                ]}
              >
                +
              </TextComponent>
            </TouchableOpacity>
          </View>
          <SpaceComponent size={16} />

          {/* Giá tổng */}
          <TextComponent
            type="subheading"
            style={[styles.totalPrice, { color: Colors.accent }]}
          >
            Tổng cộng: {totalPrice.toLocaleString("vi-VN")} VNĐ
          </TextComponent>
          <SpaceComponent size={24} />

          {/* Nút thêm vào giỏ hàng */}
          <ButtonComponent
            title="Thêm vào giỏ hàng"
            type="primary"
            onPress={handleAddToCart}
            disabled={optionsLoading || !item}
            style={[
              styles.addButton,
              {
                backgroundColor: isDarkMode ? Colors.primary : Colors.accent,
                shadowColor: Colors.black,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
                elevation: 5,
              },
            ]}
            textStyle={{
              color: Colors.white,
              fontWeight: "700",
            }}
          />
          <SpaceComponent size={24} />
        </ScrollView>
        <ToastComponent
          message={toastMessage}
          type={toastType}
          visible={toastVisible}
          onHide={handleToastHide}
          duration={1200}
        />
      </ContainerComponent>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  title: {
    marginHorizontal: 16,
  },
  description: {
    marginHorizontal: 16,
    lineHeight: 20,
  },
  price: {
    marginHorizontal: 16,
  },
  optionContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  optionName: {
    marginBottom: 4,
  },
  optionDescription: {
    marginBottom: 8,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 8,
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
    marginHorizontal: 16,
    marginBottom: 16,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginVertical: 16,
  },
  quantityLabel: {
    marginRight: 12,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  quantityButtonText: {
    fontSize: 20,
    fontWeight: "600",
  },
  quantityText: {
    fontSize: 20,
    fontWeight: "700",
  },
  totalPrice: {
    marginHorizontal: 16,
    textAlign: "right",
  },
  addButton: {
    marginHorizontal: 16,
    borderRadius: 12,
    paddingVertical: 16,
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
  },
  loadingContainer: {
    marginHorizontal: 16,
    minHeight: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MenuItemDetail;
