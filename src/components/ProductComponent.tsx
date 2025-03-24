import { Image, StyleSheet } from "react-native";
import CardComponent from "./CardComponent";
import ButtonComponent from "./ButtonComponent";
import RowComponent from "./RowComponent";
import TextComponent from "./TextComponent";
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
      onAddToCart(id);
    } else {
      console.log("No add-to-cart handler provided");
    }
  };

  const handleCardPress = () => {
    if (onPress) {
      onPress(id);
    }
  };

  return (
    <CardComponent
      styles={[styles.card, style]}
      onPress={onPress ? handleCardPress : undefined}
    >
      {/* Hình ảnh sản phẩm */}
      <Image
        source={{ uri: imageUrl || "https://via.placeholder.com/150" }}
        style={styles.productImage}
        resizeMode="cover"
      />

      {/* Tên sản phẩm */}
      <TextComponent
        text={name}
        styles={[styles.productName, { fontWeight: "bold" }]}
        numberOfLines={1}
        color={appColors.text}
      />

      {/* Mô tả */}
      <TextComponent
        text={description}
        styles={styles.description}
        numberOfLines={2}
        color={appColors.gray}
      />

      {/* Giá và nút Thêm */}
      <RowComponent justifyContent="space-between" styles={styles.footer}>
        <TextComponent
          text={`${basePrice.toLocaleString("vi-VN")}đ`}
          styles={[styles.price, { fontWeight: "bold" }]}
          color={appColors.text}
        />
        <ButtonComponent
          text="Thêm"
          type="primary"
          onPress={handleAddToCart}
          styles={styles.addButton}
          textStyles={styles.addButtonText}
        />
      </RowComponent>
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 150,
    padding: 10,
    borderRadius: 12,
    marginVertical: 5,
    backgroundColor: appColors.white,
  },
  productImage: {
    width: "100%",
    height: 100,
    borderRadius: 10,
  },
  productName: {
    fontSize: 14,
    marginTop: 6,
  },
  description: {
    fontSize: 11,
    marginTop: 4,
    lineHeight: 15,
  },
  footer: {
    marginTop: 6, // Giảm khoảng cách để vừa khít
    alignItems: "center", // Căn giữa các phần tử theo chiều dọc
  },
  price: {
    fontSize: 14,
  },
  addButton: {
    paddingVertical: 4,
    paddingHorizontal: 0,
    borderRadius: 6,
    marginBottom: 0,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default ProductComponent;
