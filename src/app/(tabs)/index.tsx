import { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";
import Slideshow from "../../components/SlideshowComponent";
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
import ButtonComponent from "@/src/components/ButtonComponent";
import SectionComponent from "@/src/components/SectionComponent";
import TextComponent from "@/src/components/TextComponent";

const HomePage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<IMenuItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IMenuItem | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slides = [
    {
      id: "1",
      title: "Welcome",
      description: "Chào mừng bạn đến với ứng dụng!",
      backgroundColor: "#59b2ab",
      image:
        "https://cdn.pixabay.com/photo/2020/04/29/03/30/pizza-5107039_960_720.jpg",
    },
    {
      id: "2",
      title: "Explore",
      description: "Khám phá các tính năng mới",
      backgroundColor: "#febe29",
      image:
        "https://daylambanh.edu.vn/wp-content/uploads/2024/04/cach-lam-banh-pizza.jpg",
    },
    {
      id: "3",
      title: "Enjoy",
      description: "Trải nghiệm tuyệt vời",
      backgroundColor: "#22bcb5",
      image: "https://img.dominos.vn/cach-lam-pizza-thap-cam-2.jpg",
    },
    {
      id: "4",
      title: "Enjoy",
      description: "Trải nghiệm tuyệt vời",
      backgroundColor: "#22bcb5",
      image: "https://img.dominos.vn/cach-lam-pizza-thap-cam-2.jpg",
    },
  ];

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
      const res = await getMenuItemByMenuCategoryApi(
        menuCategoryId,
        1,
        10,
        "name",
        "asc"
      );
      if (res.status === 200 && res.data?.content) {
        setProducts(res.data.content);
      } else {
        setError(res.message || "Không thể tải sản phẩm");
      }
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tải sản phẩm");
    }
  };

  const handleCategoryPress = (categoryId: number) => {
    fetchProductsByMenuCategory(categoryId);
  };

  const handleAddToCart = (
    productId: number,
    selectedOptions?: { [key: string]: string }
  ) => {
    console.log("Added to cart:", { productId, selectedOptions });
  };

  const handleProductPress = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const renderFeaturedProductItem = ({ item }: { item: IMenuItem }) => (
    <ProductComponent
      product={item}
      onAddToCart={handleAddToCart}
      onPress={handleProductPress}
      style={styles.featuredProductItem}
    />
  );

  const renderAllProductItem = ({ item }: { item: IMenuItem }) => (
    <ProductComponent
      product={item}
      onAddToCart={handleAddToCart}
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
        <Slideshow
          slides={slides}
          autoplay={true}
          showButtons={false}
          height={250}
          titleColor="#fff"
          descriptionColor="#ddd"
        />
        <CategoryComponent onCategoryPress={handleCategoryPress} />
        <SectionComponent styles={styles.productsSection}>
          <RowComponent
            justifyContent="space-between"
            styles={styles.sectionHeader}
          >
            <TextComponent
              text="Sản phẩm nổi bật"
              styles={styles.sectionTitle}
              font="bold"
              color={appColors.text}
            />
            <ButtonComponent
              text="Xem tất cả"
              type="link"
              onPress={() => router.push("/menu")}
              textColor={appColors.primary}
              textStyles={styles.viewAllText}
            />
          </RowComponent>
          <FlatList
            data={products.slice(0, 5)} // Giới hạn 5 sản phẩm nổi bật
            renderItem={renderFeaturedProductItem}
            keyExtractor={(item) => String(item.id)}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredProductList}
            snapToInterval={160}
            decelerationRate="fast"
            initialNumToRender={5}
            maxToRenderPerBatch={5}
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
    paddingHorizontal: 5, // Thêm padding ngang để đồng bộ
  },
  sectionHeader: {
    marginBottom: 8, // Khoảng cách giữa tiêu đề và danh sách
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  viewAllText: {
    fontSize: 14,
    textDecorationLine: "underline",
  },
  featuredProductList: {
    paddingVertical: 5,
  },
  featuredProductItem: {
    marginRight: 10, // Khoảng cách giữa các sản phẩm nổi bật
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
    justifyContent: "space-between", // Căn đều 2 cột
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

export default HomePage;
