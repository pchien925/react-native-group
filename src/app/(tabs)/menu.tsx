import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";
import CategoryComponent from "../../components/CategoryComponent";
import ProductComponent from "../../components/ProductComponent";
import { appColors } from "@/src/constants/appColors";
import { useRouter } from "expo-router";
import ProductModalComponent from "@/src/components/ProductModelComponent";
import {
  getMenuItemByMenuCategoryApi,
  getMenuItemsApi,
} from "@/src/services/api";
import RowComponent from "@/src/components/RowComponent";
import SectionComponent from "@/src/components/SectionComponent";
import TextComponent from "@/src/components/TextComponent";

const MenuPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<IMenuItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IMenuItem | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    number | undefined
  >(undefined);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getMenuItemsApi(1, 10, "name", "asc");
        if (res.status === 200 && res.data?.content) {
          setProducts(res.data.content);
        } else {
          setError(res.message || "Không thể tải sản phẩm");
        }
      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi khi tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const fetchProductsByMenuCategory = async (menuCategoryId: number) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMenuItemByMenuCategoryApi(
        menuCategoryId,
        1,
        10,
        "name",
        "asc"
      );
      if (res.status === 200 && res.data?.content) {
        setProducts(res.data.content);
        setSelectedCategoryId(menuCategoryId);
      } else {
        setError(res.message || "Không thể tải sản phẩm");
      }
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tải sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (categoryId: number) => {
    fetchProductsByMenuCategory(categoryId);
  };

  // Hàm mở Modal khi nhấn "Thêm"
  const handleOpenModal = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setModalVisible(true);
    }
  };

  // Hàm xử lý thêm vào giỏ hàng từ Modal
  const handleAddToCart = (
    productId: number,
    selectedOptions?: { [key: string]: string },
    quantity?: number
  ) => {
    console.log("Added to cart:", { productId, selectedOptions, quantity });
    closeModal(); // Đóng Modal sau khi thêm
  };

  const handleProductPress = (productId: number) => {
    handleOpenModal(productId); // Tái sử dụng hàm mở Modal
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const renderAllProductItem = ({ item }: { item: IMenuItem }) => (
    <ProductComponent
      product={item}
      onAddToCart={handleOpenModal} // Thay đổi để mở Modal thay vì thêm trực tiếp
      onPress={handleProductPress}
      style={styles.allProductItem}
    />
  );

  if (loading) return <Text style={styles.loadingText}>Đang tải...</Text>;
  if (error) return <Text style={styles.errorText}>{error}</Text>;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <CategoryComponent
          onCategoryPress={handleCategoryPress}
          selectedCategoryId={selectedCategoryId}
        />
        <SectionComponent styles={styles.productsSection}>
          <RowComponent
            justifyContent="space-between"
            styles={styles.sectionHeader}
          >
            <TextComponent
              text="Tất cả sản phẩm"
              styles={styles.sectionTitle}
              font="bold"
              color={appColors.text}
            />
          </RowComponent>
          <FlatList
            data={products}
            renderItem={renderAllProductItem}
            keyExtractor={(item) => `all-${item.id}`}
            numColumns={2}
            contentContainerStyle={styles.allProductList}
            columnWrapperStyle={styles.columnWrapper}
            scrollEnabled={false}
            initialNumToRender={6}
            maxToRenderPerBatch={10}
          />
        </SectionComponent>
      </ScrollView>
      <ProductModalComponent
        visible={modalVisible}
        product={selectedProduct}
        onClose={closeModal}
        onAddToCart={handleAddToCart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.white || "lightgray",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  productsSection: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  sectionHeader: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  allProductList: {
    paddingVertical: 5,
  },
  allProductItem: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  loadingText: {
    fontSize: 16,
    color: appColors.text || "#000",
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

export default MenuPage;
