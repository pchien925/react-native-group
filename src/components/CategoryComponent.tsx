import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { useState, useEffect } from "react";
import { appColors } from "@/src/constants/appColors";
import { getMenuCategoriesApi } from "../services/api";

interface CategoryComponentProps {
  onCategoryPress?: (categoryId: number) => void;
}

const CategoryComponent = ({ onCategoryPress }: CategoryComponentProps) => {
  const [categories, setCategories] = useState<IMenuCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getMenuCategoriesApi(1, 10, "name", "asc");
      console.log("fetchCategories response:", res);

      // Kiểm tra theo cấu trúc thực tế từ Swagger
      if (res.status === 200 && res.data?.content) {
        setCategories(res.data.content);
        console.log("Categories set:", res.data.content);
      } else {
        const errorMsg = res.message || "Không thể tải danh mục";
        setError(errorMsg);
        console.log("API error:", errorMsg);
      }
    } catch (err: any) {
      const errorMsg = err.message || "Đã xảy ra lỗi khi tải danh mục";
      setError(errorMsg);
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const renderCategoryItem = ({ item }: { item: IMenuCategory }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => onCategoryPress && onCategoryPress(item.id)}
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.categoryImage}
        resizeMode="cover"
      />
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

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
      <Text style={styles.title}>Danh mục</Text>
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
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 15,
    width: 80,
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
