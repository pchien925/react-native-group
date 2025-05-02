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
import Toast from "react-native-toast-message"; // Import Toast
import ItemCustomizationModal from "@/components/menu/ItemCustomizationModal";

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
        Toast.show({
          type: "error",
          text1: error.message || "Không thể tải danh mục",
          visibilityTime: 1200,
        });
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
        Toast.show({
          type: "error",
          text1: error.message || "Không thể tải món nổi bật",
          visibilityTime: 1200,
        });
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
      Toast.show({
        type: "error",
        text1: error.message || "Không thể tải tùy chọn món ăn",
        visibilityTime: 1200,
      });
    } finally {
      setOptionsLoading(false);
    }
  }, []);

  const handleConfirmAdd = useCallback(() => {
    if (selectedItem) {
      if (Object.keys(selectedOptions).length === 0 && options.length > 0) {
        Toast.show({
          type: "error",
          text1: "Vui lòng chọn ít nhất một tùy chọn.",
          visibilityTime: 1200,
        });
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
          Toast.show({
            type: "success",
            text1: `${selectedItem.name} đã được thêm vào giỏ hàng!`,
            visibilityTime: 1200,
          });
        } else {
          Toast.show({
            type: "error",
            text1: (action.payload as string) || "Không thể thêm vào giỏ hàng",
            visibilityTime: 1200,
          });
        }
      });
      setModalVisible(false);
    }
  }, [dispatch, selectedItem, selectedOptions, options, quantity]);

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
          router.push("/branch");
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
