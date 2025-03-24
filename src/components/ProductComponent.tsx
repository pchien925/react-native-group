import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import CardComponent from "./CardComponent";
import { appColors } from "@/src/constants/appColors";

interface ProductComponentProps {
  product: IMenuItem;
  onAddToCart?: (productId: number) => void;
  onPress?: (productId: number) => void;
  style?: any;
}

const ProductComponent = ({
  product,
  onAddToCart,
  onPress,
  style,
}: ProductComponentProps) => {
  const { name, description, basePrice, imageUrl, id } = product;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(id); // id đã là number từ IMenuItem
    }
  };

  const handlePress = () => {
    if (onPress) {
      onPress(id);
    }
  };

  return (
    <CardComponent styles={[styles.card, style]} onPress={handlePress}>
      {/* Hình ảnh sản phẩm */}
      <Image
        source={{ uri: imageUrl }}
        style={styles.productImage}
        resizeMode="cover"
      />

      {/* Tên sản phẩm */}
      <Text style={styles.productName} numberOfLines={1}>
        {name}
      </Text>

      {/* Mô tả */}
      <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
        {description}
      </Text>

      {/* Giá và nút Thêm */}
      <View style={styles.footer}>
        <Text style={styles.price}>{basePrice.toLocaleString("vi-VN")}đ</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.addButtonText}>Thêm</Text>
        </TouchableOpacity>
      </View>
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 150, // Giảm nhẹ để phù hợp với cuộn ngang
    padding: 8, // Giảm padding để gọn hơn
    borderRadius: 10,
    marginVertical: 5, // Thêm margin dọc để tránh sát nhau
  },
  productImage: {
    width: "100%",
    height: 90, // Giảm chiều cao để cân đối
    borderRadius: 8,
  },
  productName: {
    fontSize: 13, // Giảm nhẹ để gọn hơn
    fontWeight: "bold",
    color: appColors.text || "#000",
    marginTop: 4,
  },
  description: {
    fontSize: 11,
    color: appColors.gray || "#666",
    marginTop: 2,
    lineHeight: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  price: {
    fontSize: 13, // Giảm nhẹ để cân đối
    fontWeight: "bold",
    color: appColors.text || "#000",
  },
  addButton: {
    backgroundColor: appColors.primary || "#28A745",
    borderRadius: 5,
    paddingVertical: 4, // Giảm padding để nút nhỏ hơn
    paddingHorizontal: 8,
  },
  addButtonText: {
    color: appColors.white || "#fff", // Thêm fallback
    fontSize: 11, // Giảm để phù hợp nút nhỏ
    fontWeight: "600",
  },
});

export default ProductComponent;
