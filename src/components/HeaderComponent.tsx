import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

import UserAvatarComponent from "./UserAvatarComponent";
import SearchComponent from "@/src/components/SearchComponent";
import RowComponent from "./RowComponent";
import { appColors } from "@/src/constants/appColors";

// Constants
const AVATAR_SIZE = 40;
const ICON_SIZE = 24;
const HEADER_VERTICAL_PADDING = 10;

const HeaderComponent = () => {
  const router = useRouter();

  const handleSearch = (text: string) => console.log("Searching:", text); // Sửa String thành string (TS convention)
  const handleClear = () => console.log("Cleared");
  const handleBack = () => router.back();

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
          keyboardType="email-address" // Thay email-address bằng web-search cho phù hợp hơn
          returnKeyType="search"
        />

        {/* Avatar */}
        <UserAvatarComponent
          name="User"
          size={AVATAR_SIZE}
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDQjzviHm6Pnv3Zexbi1Uy6bFB0vwptrNK3Q&s"
          styles={styles.avatar} // Sửa styles thành style cho đồng nhất với RN convention
        />
      </RowComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: appColors.primary,
    paddingVertical: HEADER_VERTICAL_PADDING, // Sử dụng paddingVertical thay cho paddingTop và paddingBottom riêng
  },
  headerRow: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  backButton: {
    width: 30,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    marginHorizontal: 6,
    flex: 1,
  },
  searchInput: {
    fontWeight: "bold",
    color: "blue",
  },
  avatar: {
    borderWidth: 2,
    borderColor: appColors.white,
  },
});

export default HeaderComponent;
