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

// Giả lập dữ liệu category với tên và hình ảnh
const mockCategories = [
  {
    id: "1",
    name: "Đồ ăn",
    image:
      "https://cdn.pixabay.com/photo/2017/12/09/08/18/pizza-3007395_960_720.jpg",
  },
  {
    id: "2",
    name: "Đồ uống",
    image:
      "https://cdn.pixabay.com/photo/2017/06/26/19/31/coffee-2443531_960_720.jpg",
  },
  {
    id: "3",
    name: "Thời trang",
    image:
      "https://cdn.pixabay.com/photo/2016/11/19/18/06/feet-1840619_960_720.jpg",
  },
  {
    id: "4",
    name: "Điện tử",
    image:
      "https://cdn.pixabay.com/photo/2016/11/29/05/45/electronics-1867916_960_720.jpg",
  },
  {
    id: "5",
    name: "Sách",
    image:
      "https://cdn.pixabay.com/photo/2016/03/27/22/22/books-1281581_960_720.jpg",
  },
];

// Interface cho category
interface Category {
  id: string;
  name: string;
  image: string;
}

interface CategoryComponentProps {
  onCategoryPress?: (categoryId: string) => void;
}

const CategoryComponent = ({ onCategoryPress }: CategoryComponentProps) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      setCategories(mockCategories);
    };
    fetchCategories();
  }, []);

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => onCategoryPress && onCategoryPress(item.id)}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.categoryImage}
        resizeMode="cover"
      />
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh mục</Text>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
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
    color: appColors.text,
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
    borderRadius: 30, // Hình tròn
    marginBottom: 5,
  },
  categoryText: {
    color: appColors.text,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default CategoryComponent;
