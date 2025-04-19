import React, { useState, useEffect } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import ContainerComponent from "@/components/common/ContainerComponent";
import SpaceComponent from "@/components/common/SpaceComponent";
import ToastComponent from "@/components/common/ToastComponent";
import CategoryList from "@/components/menu/CategoryList";
import MenuItemList from "@/components/menu/MenuItemList";
import ItemCustomizationModal from "@/components/menu/ItemCustomizationModal";
import { defaultOptions } from "@/data/optionData";
import { sampleMenuItems } from "@/data/menuItemsData";
import { initialCategories } from "@/data/categoryData";
import { useAppDispatch } from "@/store/store";
import { addToCart } from "@/store/slices/cartSlice";

// Interfaces
interface IPaginationData<T> {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  content: T[];
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

interface IMenuItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  basePrice: number;
}

interface IMenuCategory {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

interface ICartItem {
  id: number;
  quantity: number;
  priceAtAddition: number;
  menuItem: IMenuItem;
  options: IOptionValue[];
}

const MenuScreen = () => {
  console.log("MenuScreen rendered");
  const { isDarkMode } = useTheme();
  const dispatch = useAppDispatch();
  const [selectedCategory, setSelectedCategory] =
    useState<IMenuCategory | null>(initialCategories[0]);
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IMenuItem | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: number]: IOptionValue;
  }>({});
  const [quantity, setQuantity] = useState(1);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Fetch paginated data from sampleMenuItems with manual filtering
  const fetchMenuItems = async (
    pageNum: number,
    categoryId: number | null
  ): Promise<IPaginationData<IMenuItem>> => {
    setLoading(true);
    const pageSize = 5;

    // Lọc sản phẩm thủ công dựa trên tên theo danh mục
    const filteredItems = sampleMenuItems.filter((item) => {
      const name = item.name.toLowerCase();
      if (!categoryId) return true; // Không lọc nếu không có danh mục
      switch (categoryId) {
        case 1: // Pizza
          return name.includes("pizza");
        case 2: // Mì Ý
          return name.includes("mì ý");
        case 3: // Gà Rán
          return name.includes("gà rán") || name.includes("cánh gà");
        case 4: // Burger
          return name.includes("burger");
        case 5: // Món Khai Vị
          return (
            name.includes("salad") ||
            name.includes("súp") ||
            name.includes("khoai") ||
            name.includes("tôm")
          );
        case 6: // Đồ Uống
          return (
            name.includes("nước") ||
            name.includes("trà") ||
            name.includes("cà phê") ||
            name.includes("sinh tố")
          );
        default:
          return true;
      }
    });

    const totalElements = filteredItems.length;
    const totalPages = Math.ceil(totalElements / pageSize);
    const startIndex = (pageNum - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    const paginatedResponse: IPaginationData<IMenuItem> = {
      currentPage: pageNum,
      totalPages,
      totalElements,
      pageSize,
      content: paginatedItems,
    };

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay
    setLoading(false);
    return paginatedResponse;
  };

  useEffect(() => {
    if (selectedCategory) {
      fetchMenuItems(page, selectedCategory.id).then((response) => {
        setMenuItems((prev) =>
          page === 1 ? response.content : [...prev, ...response.content]
        );
        setTotalPages(response.totalPages);
      });
    }
  }, [page, selectedCategory]);

  const handleLoadMore = () => {
    if (!loading && page < totalPages && !refreshing) {
      setPage((prev) => prev + 1);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setMenuItems([]);
    setPage(1);
    if (selectedCategory) {
      fetchMenuItems(1, selectedCategory.id).then((response) => {
        setMenuItems(response.content);
        setTotalPages(response.totalPages);
        setRefreshing(false);
      });
    } else {
      setRefreshing(false);
    }
  };

  const handleCategoryPress = (category: IMenuCategory) => {
    setSelectedCategory(category);
    setMenuItems([]);
    setPage(1);
  };

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
    <ContainerComponent>
      <CategoryList
        categories={initialCategories}
        selectedCategory={selectedCategory}
        onCategoryPress={handleCategoryPress}
      />
      <SpaceComponent size={16} />
      <MenuItemList
        menuItems={menuItems}
        loading={loading}
        refreshing={refreshing}
        onRefresh={onRefresh}
        onLoadMore={handleLoadMore}
        onAddToCart={handleAddToCart}
      />
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

export default MenuScreen;
