import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { appColors } from "@/src/constants/appColors";
import { getMenuCategoriesApi } from "../services/api";

interface CategoryComponentProps {
  onCategoryPress?: (categoryId: number) => void;
  selectedCategoryId?: number; // Thêm prop để nhận category đã chọn từ MenuPage
}

const CategoryComponent = ({
  onCategoryPress,
  selectedCategoryId,
}: CategoryComponentProps) => {
  const [categories, setCategories] = useState<IMenuCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getMenuCategoriesApi(1, 10, "name", "asc");
      if (res.status === 200 && res.data?.content) {
        setCategories(res.data.content);
      } else {
        setError(res.message || "Không thể tải danh mục");
      }
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tải danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const renderCategoryItem = ({ item }: { item: IMenuCategory }) => {
    const isSelected = item.id === selectedCategoryId; // Kiểm tra xem category này có được chọn không
    return (
      <TouchableOpacity
        style={[styles.categoryItem, isSelected && styles.selectedCategoryItem]}
        onPress={() => onCategoryPress && onCategoryPress(item.id)}
      >
        <Image
          source={{ uri: item.imageUrl || "https://via.placeholder.com/60" }}
          style={styles.categoryImage}
          resizeMode="cover"
        />
        <Text
          style={[
            styles.categoryText,
            isSelected && styles.selectedCategoryText,
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchCategories} style={styles.retryButton}>
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thực đơn</Text>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => String(item.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: appColors.text || "#000",
    paddingHorizontal: 16, // Đồng bộ với listContainer
    marginBottom: 10,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 15,
    width: 80,
    paddingVertical: 5,
    borderRadius: 8,
  },
  selectedCategoryItem: {
    backgroundColor: appColors.white2 || "#E6F0FF", // Màu nền khi được chọn
    borderWidth: 1,
    borderColor: appColors.primary || "#007AFF",
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
  },
  categoryText: {
    color: appColors.text || "#000",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  selectedCategoryText: {
    color: appColors.primary || "#007AFF", // Màu chữ khi được chọn
    fontWeight: "600",
  },
  loadingText: {
    fontSize: 16,
    color: appColors.text || "#000",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  retryButton: {
    padding: 10,
    backgroundColor: appColors.primary || "#007AFF",
    borderRadius: 5,
    alignSelf: "center",
  },
  retryText: {
    color: appColors.white || "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default CategoryComponent;
