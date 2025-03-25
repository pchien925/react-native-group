// app/menu/[id].tsx
import { useLocalSearchParams } from "expo-router";
import ContainerComponent from "../../components/ContainerComponent";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import TextComponent from "../../components/TextComponent";
import { appColors } from "../../constants/appColors";
import RowComponent from "../../components/RowComponent";
import ButtonComponent from "../../components/ButtonComponent";
import SectionComponent from "../../components/SectionComponent";
import { useState, useEffect } from "react";
import { getMenuItemByIdApi } from "@/src/services/api";

const MenuItemDetailScreen = () => {
  const { id } = useLocalSearchParams(); // id là string từ useLocalSearchParams
  const [menuItem, setMenuItem] = useState<IMenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: IOptionValue;
  }>({});

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMenuItemByIdApi(Number(id)); // Chuyển id sang number
        if (response.status === 200 && response.data) {
          setMenuItem(response.data); // Lấy dữ liệu từ response.data
        } else {
          setError(response.message || "Không thể tải sản phẩm");
        }
      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi khi tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchMenuItem();
  }, [id]);

  if (loading) {
    return (
      <ContainerComponent>
        <TextComponent text="Đang tải..." styles={styles.loadingText} />
      </ContainerComponent>
    );
  }

  if (error || !menuItem) {
    return (
      <ContainerComponent>
        <TextComponent
          text={error || "Không tìm thấy món ăn"}
          styles={styles.errorText}
        />
      </ContainerComponent>
    );
  }

  const handleAddToCart = () => {
    console.log(`Added ${menuItem.id} to cart with quantity: ${quantity}`, {
      selectedOptions,
    });
    // Thêm logic thêm vào giỏ hàng ở đây (có thể gọi API khác nếu cần)
  };

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const handleOptionSelect = (optionTypeId: number, value: IOptionValue) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionTypeId]: value,
    }));
  };

  return (
    <ContainerComponent back title={menuItem.name} isScrollable>
      <SectionComponent>
        <Image
          source={{
            uri: menuItem.imageUrl || "https://via.placeholder.com/300",
          }}
          style={styles.image}
          resizeMode="cover"
        />
      </SectionComponent>

      <SectionComponent>
        <TextComponent
          text={menuItem.name}
          size={24}
          font="bold"
          color={appColors.text}
        />
        <TextComponent
          text={menuItem.description}
          color={appColors.gray}
          size={16}
          styles={styles.description}
        />
        <TextComponent
          text={`${menuItem.basePrice.toLocaleString("vi-VN")}đ`}
          size={20}
          font="bold"
          color={appColors.text}
          styles={styles.price}
        />
      </SectionComponent>

      {/* Hiển thị và chọn OptionTypes */}
      {menuItem.optionTypes && menuItem.optionTypes.length > 0 && (
        <SectionComponent>
          {menuItem.optionTypes.map((optionType) => (
            <SectionComponent key={optionType.id}>
              <TextComponent
                text={optionType.name}
                size={18}
                font="medium"
                color={appColors.text}
                styles={styles.optionTypeTitle}
              />
              {optionType.optionValues.map((value) => {
                const isSelected =
                  selectedOptions[optionType.id]?.id === value.id;
                return (
                  <TouchableOpacity
                    key={value.id}
                    onPress={() => handleOptionSelect(optionType.id, value)}
                    style={[
                      styles.optionRow,
                      isSelected && styles.optionRowSelected,
                    ]}
                    disabled={!value.available} // Vô hiệu hóa nếu không available
                  >
                    <RowComponent justifyContent="space-between">
                      <TextComponent
                        text={value.name}
                        color={
                          isSelected
                            ? appColors.primary
                            : value.available
                            ? appColors.text
                            : appColors.gray
                        }
                      />
                      <TextComponent
                        text={
                          value.extraCost > 0
                            ? `+${value.extraCost.toLocaleString("vi-VN")}đ`
                            : "Miễn phí"
                        }
                        color={
                          isSelected
                            ? appColors.primary
                            : value.available
                            ? appColors.gray
                            : appColors.gray
                        }
                      />
                    </RowComponent>
                  </TouchableOpacity>
                );
              })}
            </SectionComponent>
          ))}
        </SectionComponent>
      )}

      {/* Chọn số lượng và nút Thêm vào giỏ hàng ở cuối */}
      <SectionComponent styles={styles.footer}>
        <RowComponent justifyContent="center" styles={styles.quantityContainer}>
          <TouchableOpacity
            onPress={handleDecrease}
            style={styles.quantityButton}
          >
            <TextComponent text="-" size={20} color={appColors.text} />
          </TouchableOpacity>
          <TextComponent
            text={quantity.toString()}
            size={18}
            styles={styles.quantityText}
            color={appColors.text}
          />
          <TouchableOpacity
            onPress={handleIncrease}
            style={styles.quantityButton}
          >
            <TextComponent text="+" size={20} color={appColors.text} />
          </TouchableOpacity>
        </RowComponent>
        <ButtonComponent
          text="Thêm vào giỏ hàng"
          type="primary"
          onPress={handleAddToCart}
          styles={styles.addButton}
        />
      </SectionComponent>
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 250,
    borderRadius: 12,
  },
  description: {
    marginTop: 8,
    lineHeight: 22,
  },
  price: {
    marginTop: 12,
  },
  optionTypeTitle: {
    marginBottom: 8,
  },
  optionRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: appColors.gray + "20",
  },
  optionRowSelected: {
    backgroundColor: appColors.primary + "10",
  },
  footer: {
    paddingBottom: 20,
  },
  quantityContainer: {
    marginBottom: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: appColors.gray,
    borderRadius: 8,
  },
  quantityText: {
    marginHorizontal: 20,
  },
  addButton: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 8,
  },
  loadingText: {
    fontSize: 16,
    color: appColors.text,
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});

export default MenuItemDetailScreen;
