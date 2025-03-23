import { View, Text, StyleSheet, FlatList, ScrollView } from "react-native";
import React from "react";
import Slideshow from "../../components/SlideshowComponent";
import CategoryComponent from "../../components/CategoryComponent";
import ProductComponent, { Product } from "../../components/ProductComponent";
import { appColors } from "@/src/constants/appColors";
import { useRouter } from "expo-router";

// Giả lập dữ liệu sản phẩm
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Gà Giòn Không Xương Xốt Hàn M...",
    description: "Vị gà ngọt ngào với xốt mật on...",
    price: 79000,
    image:
      "https://cdn.pixabay.com/photo/2017/07/16/11/51/fried-chicken-2508639_960_720.jpg",
  },
  {
    id: "2",
    name: "Pizza Hải Sản",
    description: "Pizza với tôm, mực và phô mai...",
    price: 129000,
    image:
      "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_960_720.jpg",
  },
  {
    id: "3",
    name: "Cánh Gà Chiên Nước Mắm",
    description: "Cánh gà giòn rụm với nước mắm...",
    price: 69000,
    image:
      "https://cdn.pixabay.com/photo/2017/07/16/11/51/fried-chicken-2508639_960_720.jpg",
  },
  {
    id: "4",
    name: "Mì Ý Sốt Bò Bằm",
    description: "Mì Ý thơm ngon với sốt bò bằm...",
    price: 89000,
    image:
      "https://cdn.pixabay.com/photo/2017/06/01/07/15/pasta-2361856_960_720.jpg",
  },
  {
    id: "5",
    name: "Mì Ý Sốt Bò Bằm",
    description: "Mì Ý thơm ngon với sốt bò bằm...",
    price: 89000,
    image:
      "https://cdn.pixabay.com/photo/2017/06/01/07/15/pasta-2361856_960_720.jpg",
  },
  {
    id: "6",
    name: "Mì Ý Sốt Bò Bằm",
    description: "Mì Ý thơm ngon với sốt bò bằm...",
    price: 89000,
    image:
      "https://cdn.pixabay.com/photo/2017/06/01/07/15/pasta-2361856_960_720.jpg",
  },
];

const HomePage = () => {
  const router = useRouter();

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

  const handleCategoryPress = (categoryId: string) => {
    console.log("Selected category ID:", categoryId);
  };

  const handleAddToCart = (productId: string) => {
    console.log("Added to cart, product ID:", productId);
  };

  const handleProductPress = (productId: string) => {
    console.log("Product pressed, ID:", productId);
  };

  const renderFeaturedProductItem = ({ item }: { item: Product }) => (
    <ProductComponent
      product={item}
      onAddToCart={handleAddToCart}
      onPress={handleProductPress}
      style={styles.featuredProductItem} // Style cho sản phẩm nổi bật
    />
  );

  const renderAllProductItem = ({ item }: { item: Product }) => (
    <ProductComponent
      product={item}
      onAddToCart={handleAddToCart}
      onPress={handleProductPress}
      style={styles.allProductItem} // Style cho tất cả sản phẩm
    />
  );

  return (
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
      {/* Sản phẩm nổi bật */}
      <View style={styles.productsSection}>
        <Text style={styles.sectionTitle}>Sản phẩm nổi bật</Text>
        <FlatList
          data={mockProducts}
          renderItem={renderFeaturedProductItem}
          keyExtractor={(item) => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredProductList}
          snapToInterval={160}
          decelerationRate="fast"
        />
      </View>
      {/* Tất cả sản phẩm */}
      <View style={styles.productsSection}>
        <Text style={styles.sectionTitle}>Tất cả sản phẩm</Text>
        <FlatList
          data={mockProducts}
          renderItem={renderAllProductItem}
          keyExtractor={(item) => `all-${item.id}`}
          numColumns={2}
          contentContainerStyle={styles.allProductList}
          columnWrapperStyle={{ paddingHorizontal: 0 }}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
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
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: appColors.text || "#000",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  featuredProductList: {
    paddingHorizontal: 16, // Khoảng cách hai bên danh sách
  },
  featuredProductItem: {
    marginRight: 20, // Tăng khoảng cách giữa các sản phẩm lên 20 (trước là 10)
    width: 150,
  },
  allProductList: {
    paddingHorizontal: 10, // Khoảng cách hai bên danh sách
  },
  allProductItem: {
    flex: 1, // Mỗi mục chiếm đều không gian trong cột
    marginHorizontal: 5, // Khoảng cách ngang giữa các sản phẩm
    marginVertical: 5, // Khoảng cách dọc giữa các hàng
  },
});

export default HomePage;
