import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

import SearchComponent from "@/src/components/SearchComponent";
import RowComponent from "./RowComponent";
import { appColors } from "@/src/constants/appColors";

// Constants
const CART_ICON_SIZE = 24; // Kích thước icon giỏ hàng
const ICON_SIZE = 20;
const HEADER_VERTICAL_PADDING = 5;

const HeaderComponent = () => {
  const router = useRouter();

  const handleSearch = (text: string) => console.log("Searching:", text);
  const handleClear = () => console.log("Cleared");
  const handleBack = () => router.back();
  const handleCartPress = () => {
    // Xử lý khi nhấn vào giỏ hàng - bạn có thể điều hướng đến màn hình giỏ hàng
    console.log("Cart pressed");
    // Ví dụ điều hướng đến màn hình cart
  };

  return (
    <View style={styles.headerContainer}>
      <RowComponent justifyContent="space-between" styles={styles.headerRow}>
        {/* Back Button */}
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <AntDesign name="arrowleft" size={ICON_SIZE} color={appColors.text} />
        </TouchableOpacity>

        {/* Search */}
        <SearchComponent
          placeholder="Tìm kiếm..."
          onSearch={handleSearch}
          containerStyles={styles.searchContainer}
          inputStyles={styles.searchInput}
          clearable
          onClear={handleClear}
          keyboardType="email-address"
          returnKeyType="search"
        />

        {/* Cart Icon */}
        <TouchableOpacity onPress={handleCartPress} style={styles.cartButton}>
          <AntDesign
            name="shoppingcart"
            size={CART_ICON_SIZE}
            color={appColors.text}
          />
        </TouchableOpacity>
      </RowComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: appColors.primary,
    paddingVertical: HEADER_VERTICAL_PADDING,
  },
  headerRow: {
    paddingHorizontal: 10,
    alignItems: "center",
  },
  backButton: {
    width: 25,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    marginHorizontal: 10,
    flex: 1,
  },
  searchInput: {
    height: 38,
    color: "black",
  },
  cartButton: {
    width: 35, // Điều chỉnh kích thước nút giỏ hàng
    height: 35,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default HeaderComponent;
