// components/home/HomeScreen.tsx
import React, { useState, useEffect } from "react";
import { Linking, Modal, StyleSheet, View } from "react-native";
import ContainerComponent from "@/components/common/ContainerComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import CategorySection from "@/components/home/CategorySectionComponent";
import OfferSection from "@/components/home/OfferSectionComponent";
import BannerSectionComponent from "@/components/home/BannerSwiperComponent";
import { banners } from "@/data/bannerData";
import RowComponent from "@/components/common/RowComponent";
import TextComponent from "@/components/common/TextComponent";
import ToastComponent from "@/components/common/ToastComponent";
import ItemCustomizationModal from "@/components/menu/ItemCustomizationModal";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/ThemeContext";
import SectionTitleComponent from "@/components/home/SectionTitleComponent";
import { useAppDispatch } from "@/store/store";
import { addToCart } from "@/store/slices/cartSlice";
import { getMenuCategoriesApi, getMenuItemsApi } from "@/services/api";
import { router } from "expo-router";

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

const HomeScreen: React.FC = () => {
  console.log("HomeScreen rendered");
  const { isDarkMode } = useTheme();
  const dispatch = useAppDispatch();
  const [categories, setCategories] = useState<IMenuCategory[]>([]);
  const [featuredOffers, setFeaturedOffers] = useState<IMenuItem[]>([]);
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

  // Lấy danh mục từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getMenuCategoriesApi();
        if (response.error || !response.data) {
          if (
            response.error &&
            response.error.includes("Current user not found")
          ) {
            router.replace("/login");
          }
          throw new Error(response.message || "Failed to fetch categories");
        }
        setCategories(response.data);
      } catch (error: any) {
        setToastMessage(error.message || "Không thể tải danh mục");
        setToastType("error");
        setToastVisible(true);
      }
    };
    fetchCategories();
  }, []);

  // Lấy danh sách món ăn nổi bật từ API
  useEffect(() => {
    const fetchFeaturedOffers = async () => {
      try {
        const response = await getMenuItemsApi(1, 6, "id", "asc");
        if (response.error || !response.data) {
          if (
            response.error &&
            response.error.includes("Current user not found")
          ) {
            router.replace("/login");
          }
          throw new Error(
            response.message || "Failed to fetch featured offers"
          );
        }
        setFeaturedOffers(response.data.content);
      } catch (error: any) {
        setToastMessage(error.message || "Không thể tải món nổi bật");
        setToastType("error");
        setToastVisible(true);
      }
    };
    fetchFeaturedOffers();
  }, []);

  const handleAddToCart = (item: IMenuItem) => {
    setSelectedItem(item);
    setSelectedOptions({});
    setQuantity(1);
    setModalVisible(true);
  };

  const handleConfirmAdd = () => {
    if (selectedItem) {
      // Giả định cần chọn ít nhất một tùy chọn
      if (Object.keys(selectedOptions).length === 0) {
        setToastMessage("Vui lòng chọn ít nhất một tùy chọn.");
        setToastType("error");
        setToastVisible(true);
        return;
      }
      dispatch(
        addToCart({
          menuItemId: selectedItem.id,
          quantity,
          options: Object.values(selectedOptions),
        })
      ).then((action) => {
        if (addToCart.fulfilled.match(action)) {
          setToastMessage(`${selectedItem.name} đã được thêm vào giỏ hàng!`);
          setToastType("success");
        } else {
          setToastMessage(
            (action.payload as string) || "Không thể thêm vào giỏ hàng"
          );
          setToastType("error");
        }
        setToastVisible(true);
      });
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
        categories={categories}
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
          Linking.openURL(`tel:19990000`);
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
