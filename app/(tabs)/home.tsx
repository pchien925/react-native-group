// components/home/HomeScreen.tsx
import React, { useState, useEffect, useCallback } from "react";
import { Linking, StyleSheet, View } from "react-native";
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
import {
  getMenuCategoriesApi,
  getMenuItemsApi,
  getOptionsByMenuItemApi,
} from "@/services/api";
import { router } from "expo-router";

const HomeScreen: React.FC = () => {
  console.log("HomeScreen rendered");
  const { isDarkMode } = useTheme();
  const dispatch = useAppDispatch();
  const [categories, setCategories] = useState<IMenuCategory[]>([]);
  const [featuredOffers, setFeaturedOffers] = useState<IMenuItem[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [offersLoading, setOffersLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IMenuItem | null>(null);
  const [options, setOptions] = useState<IOption[]>([]);
  const [optionsLoading, setOptionsLoading] = useState(false);
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
      setCategoriesLoading(true);
      try {
        const response = await getMenuCategoriesApi();
        if (response.error || !response.data) {
          if (response.error?.includes("Current user not found")) {
            router.replace("/login");
          }
          throw new Error(response.message || "Failed to fetch categories");
        }
        setCategories(response.data);
      } catch (error: any) {
        setToastMessage(error.message || "Không thể tải danh mục");
        setToastType("error");
        setToastVisible(true);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Lấy danh sách món ăn nổi bật từ API
  useEffect(() => {
    const fetchFeaturedOffers = async () => {
      setOffersLoading(true);
      try {
        const response = await getMenuItemsApi(1, 6, "id", "asc");
        if (response.error || !response.data) {
          if (response.error?.includes("Current user not found")) {
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
      } finally {
        setOffersLoading(false);
      }
    };
    fetchFeaturedOffers();
  }, []);

  const handleAddToCart = useCallback(async (item: IMenuItem) => {
    setSelectedItem(item);
    setSelectedOptions({});
    setQuantity(1);
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
      setModalVisible(true);
    } catch (error: any) {
      console.error("Error fetching options:", error);
      setToastMessage(error.message || "Không thể tải tùy chọn món ăn");
      setToastType("error");
      setToastVisible(true);
    } finally {
      setOptionsLoading(false);
    }
  }, []);

  const handleConfirmAdd = useCallback(() => {
    if (selectedItem) {
      if (Object.keys(selectedOptions).length === 0 && options.length > 0) {
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
  }, [dispatch, selectedItem, selectedOptions, options, quantity]);

  const handleToastHide = useCallback(() => {
    setToastVisible(false);
    setToastMessage("");
    setToastType("success");
  }, []);

  const handleModalClose = useCallback(() => {
    setModalVisible(false);
    setSelectedItem(null);
    setSelectedOptions({});
    setQuantity(1);
    setOptions([]);
  }, []);

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
        style={[
          styles.sectionContainer,
          {
            backgroundColor: isDarkMode
              ? Colors.backgroundDark
              : Colors.backgroundLight,
            borderColor: isDarkMode ? Colors.borderDark : Colors.borderLight,
            shadowColor: Colors.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          },
        ]}
        onPress={() => {
          console.log("Navigate to all stores");
          // TODO: Điều hướng đến màn hình danh sách cửa hàng
        }}
      >
        <TextComponent
          type="subheading"
          style={{
            color: isDarkMode
              ? Colors.textDarkPrimary
              : Colors.textLightPrimary,
          }}
        >
          Danh sách cửa hàng
        </TextComponent>
        <Ionicons
          name="chevron-forward"
          size={24}
          color={isDarkMode ? Colors.textDarkPrimary : Colors.backgroundDark}
        />
      </RowComponent>
      <SpaceComponent size={24} />
      <SectionTitleComponent title="Liên hệ với chúng tôi" />
      <RowComponent
        alignItems="center"
        justifyContent="space-between"
        style={[
          styles.sectionContainer,
          {
            backgroundColor: isDarkMode
              ? Colors.backgroundDark
              : Colors.backgroundLight,
            borderColor: isDarkMode ? Colors.borderDark : Colors.borderLight,
            shadowColor: Colors.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          },
        ]}
        onPress={() => {
          Linking.openURL(`tel:19990000`);
        }}
      >
        <TextComponent
          type="body"
          style={{ color: isDarkMode ? Colors.secondary : Colors.secondary }}
        >
          Cần sự hỗ trợ?
        </TextComponent>
        <TextComponent
          type="body"
          style={{ color: isDarkMode ? Colors.secondary : Colors.secondary }}
        >
          19990000
        </TextComponent>
      </RowComponent>
      <SpaceComponent size={24} />
      <ItemCustomizationModal
        visible={modalVisible}
        item={selectedItem}
        options={options}
        categoryId={null}
        onClose={handleModalClose}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        quantity={quantity}
        setQuantity={setQuantity}
        onConfirm={handleConfirmAdd}
        isDarkMode={isDarkMode}
        loading={optionsLoading}
      />
      <ToastComponent
        message={toastMessage}
        type={toastType}
        visible={toastVisible}
        onHide={handleToastHide}
        duration={1200}
      />
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    margin: 8,
  },
});

export default HomeScreen;
