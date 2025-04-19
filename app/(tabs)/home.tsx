import React, { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import ContainerComponent from "@/components/common/ContainerComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import CategorySection from "@/components/home/CategorySectionComponent";
import OfferSection from "@/components/home/OfferSectionComponent";
import BannerSectionComponent from "@/components/home/BannerSwiperComponent";
import RowComponent from "@/components/common/RowComponent";
import TextComponent from "@/components/common/TextComponent";
import ToastComponent from "@/components/common/ToastComponent";
import ItemCustomizationModal from "@/components/menu/ItemCustomizationModal";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import SectionTitleComponent from "@/components/home/SectionTitleComponent";
import { defaultOptions } from "@/data/optionData";
import { banners } from "@/data/bannerData";
import { initialCategories } from "@/data/categoryData";
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

interface ICartItem {
  id: number;
  quantity: number;
  priceAtAddition: number;
  menuItem: IMenuItem;
  options: IOptionValue[];
}

// Chọn một số sản phẩm từ sampleMenuItems làm featuredOffers
const featuredOffers: IMenuItem[] = [
  sampleMenuItems.find((item) => item.id === 1)!, // Pizza Margherita
  sampleMenuItems.find((item) => item.id === 4)!, // Mì Ý Carbonara
  sampleMenuItems.find((item) => item.id === 7)!, // Gà Rán Giòn
  sampleMenuItems.find((item) => item.id === 10)!, // Burger Bò Phô Mai
  sampleMenuItems.find((item) => item.id === 13)!, // Salad Caesar
  sampleMenuItems.find((item) => item.id === 17)!, // Nước Cam Ép
].filter((item) => item !== undefined); // Lọc bỏ undefined (để an toàn)

const HomeScreen: React.FC = () => {
  console.log("HomeScreen rendered");
  const { isDarkMode } = useTheme();
  const dispatch = useAppDispatch();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IMenuItem | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: IOptionValue;
  }>({});
  const [quantity, setQuantity] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const handleAddToCart = (item: IMenuItem) => {
    setSelectedItem(item);
    setSelectedOptions({});
    setQuantity(1);
    setModalVisible(true);
  };

  const calculateTotalPrice = () => {
    if (!selectedItem) return 0;
    const optionsPrice = Object.values(selectedOptions).reduce(
      (sum, option) => sum + option.additionalPrice,
      0
    );
    return (selectedItem.basePrice + optionsPrice) * quantity;
  };

  const handleConfirmAdd = () => {
    if (selectedItem) {
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
        menuItem: selectedItem,
        options: Object.values(selectedOptions),
      };
      dispatch(addToCart(cartItem));
      setToastMessage(`${selectedItem.name} đã được thêm vào giỏ hàng!`);
      setToastType("success");
      setToastVisible(true);
      setModalVisible(false);
    }
  };

  const handleToastHide = () => {
    setToastVisible(false);
    setToastMessage("");
    setToastType("success");
  };

  return (
    <ContainerComponent scrollable>
      <SpaceComponent size={16} />
      <BannerSectionComponent banners={banners} />
      <SpaceComponent size={24} />
      <CategorySection
        categories={initialCategories}
        selectedCategoryId={selectedCategoryId}
        onCategoryPress={(categoryId) => setSelectedCategoryId(categoryId)}
      />
      <OfferSection
        offers={featuredOffers.map((item) => ({
          id: Number(item.id),
          name: item.name,
          description: item.description,
          imageUrl: item.imageUrl,
          basePrice: Number(item.basePrice),
        }))}
        onAddToCart={handleAddToCart}
      />
      <RowComponent
        alignItems="center"
        justifyContent="space-between"
        style={{
          paddingHorizontal: 8,
          paddingVertical: 16,
          backgroundColor: Colors.backgroundLight,
          borderRadius: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          margin: 8,
        }}
        onPress={() => {
          console.log("Navigate to all stores");
        }}
      >
        <TextComponent type="subheading">Danh sách cửa hàng</TextComponent>
        <Ionicons
          name="chevron-forward"
          size={24}
          color={Colors.backgroundDark}
        />
      </RowComponent>
      <SpaceComponent size={24} />
      <SectionTitleComponent title="Liên hệ với chúng tôi" />
      <RowComponent
        alignItems="center"
        justifyContent="space-between"
        style={{
          paddingHorizontal: 16,
          paddingVertical: 16,
          backgroundColor: Colors.backgroundLight,
          borderRadius: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
          margin: 8,
        }}
        onPress={() => {
          console.log("Navigate to all stores");
        }}
      >
        <TextComponent type="body" style={{ color: Colors.secondary }}>
          Cần sự hỗ trợ?
        </TextComponent>
        <TextComponent type="body" style={{ color: Colors.secondary }}>
          19990000
        </TextComponent>
      </RowComponent>
      <SpaceComponent size={24} />
      <ItemCustomizationModal
        visible={modalVisible}
        item={selectedItem}
        categoryId={null}
        onClose={() => setModalVisible(false)}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        quantity={quantity}
        setQuantity={setQuantity}
        onConfirm={handleConfirmAdd}
        isDarkMode={isDarkMode}
      />
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
  toastModalContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
});

export default HomeScreen;
