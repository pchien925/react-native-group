// import React, { useState, useEffect } from "react";
// import {
//   FlatList,
//   View,
//   ActivityIndicator,
//   RefreshControl,
//   TouchableOpacity,
//   StyleSheet,
//   Modal,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";

// import ContainerComponent from "@/components/common/ContainerComponent";
// import MenuCategoryComponent from "@/components/MenuCategory/MenuCategoryComponent";
// import MenuItemComponent from "@/components/MenuItem/MenuItemComponent";
// import SpaceComponent from "@/components/common/SpaceComponent";
// import TextComponent from "@/components/common/TextComponent";
// import ButtonComponent from "@/components/common/ButtonComponent";
// import ModalComponent from "@/components/common/ModalComponent";
// import ToastComponent from "@/components/common/ToastComponent";
// import RowComponent from "@/components/common/RowComponent";
// import { Colors } from "@/constants/Colors";
// import { ScreenDimensions } from "@/constants/Dimensions";
// import { useTheme } from "@/contexts/ThemeContext";

// // Interfaces
// interface IPaginationData<T> {
//   currentPage: number;
//   totalPages: number;
//   totalElements: number;
//   pageSize: number;
//   content: T[];
// }

// interface IOptionValue {
//   id: number;
//   value: string;
//   additionalPrice: number;
// }

// interface IOption {
//   id: number;
//   name: string;
//   description: string;
//   IOptionValues: IOptionValue[];
// }

// interface IMenuItem {
//   id: number;
//   name: string;
//   description: string;
//   imageUrl: string;
//   basePrice: number;
//   options: IOption[];
// }

// interface IMenuCategory {
//   id: number;
//   name: string;
//   description: string;
//   imageUrl: string;
// }

// // Sample data for categories (static)
// const initialCategories: IMenuCategory[] = [
//   {
//     id: 1,
//     name: "Món Chính",
//     description: "Các món ăn thịnh soạn cho bữa chính",
//     imageUrl: "https://example.com/images/main-course.jpg",
//   },
//   {
//     id: 2,
//     name: "Khai Vị",
//     description: "Món khai vị nhẹ nhàng kích thích vị giác",
//     imageUrl: "https://example.com/images/appetizers.jpg",
//   },
//   {
//     id: 3,
//     name: "Tráng Miệng",
//     description: "Món ngọt ngào kết thúc bữa ăn",
//     imageUrl: "https://example.com/images/desserts.jpg",
//   },
//   {
//     id: 4,
//     name: "Đồ Uống",
//     description: "Đồ uống giải khát bổ sung cho bữa ăn",
//     imageUrl: "https://example.com/images/beverages.jpg",
//   },
// ];

// const MenuScreen = () => {
//   const { isDarkMode } = useTheme();
//   const width = ScreenDimensions.WIDTH;
//   const numColumns = width > 600 ? 3 : 2;
//   const [selectedCategory, setSelectedCategory] =
//     useState<IMenuCategory | null>(initialCategories[0]);
//   const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<IMenuItem | null>(null);
//   const [selectedOptions, setSelectedOptions] = useState<{
//     [key: number]: IOptionValue;
//   }>({});
//   const [quantity, setQuantity] = useState(1);
//   const [toastVisible, setToastVisible] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const [toastType, setToastType] = useState<"success" | "error">("success");

//   // Simulate fetching paginated data
//   const fetchMenuItems = async (
//     pageNum: number,
//     categoryId: number | null
//   ): Promise<IPaginationData<IMenuItem>> => {
//     setLoading(true);
//     // Sample options for menu items
//     const sampleOptions: IOption[] =
//       categoryId === 1
//         ? [
//             {
//               id: 1,
//               name: "Kích thước",
//               description: "Chọn kích thước khẩu phần",
//               IOptionValues: [
//                 { id: 1, value: "Nhỏ", additionalPrice: 0 },
//                 { id: 2, value: "Vừa", additionalPrice: 20000 },
//                 { id: 3, value: "Lớn", additionalPrice: 40000 },
//               ],
//             },
//             {
//               id: 2,
//               name: "Topping",
//               description: "Thêm topping tùy chọn",
//               IOptionValues: [
//                 { id: 4, value: "Phô mai", additionalPrice: 15000 },
//                 { id: 5, value: "Thịt xông khói", additionalPrice: 25000 },
//                 { id: 6, value: "Không", additionalPrice: 0 },
//               ],
//             },
//           ]
//         : categoryId === 2
//         ? [
//             {
//               id: 1,
//               name: "Gia vị",
//               description: "Chọn mức độ gia vị",
//               IOptionValues: [
//                 { id: 1, value: "Cay", additionalPrice: 5000 },
//                 { id: 2, value: "Không cay", additionalPrice: 0 },
//               ],
//             },
//           ]
//         : categoryId === 3
//         ? [
//             {
//               id: 1,
//               name: "Độ ngọt",
//               description: "Chọn mức độ ngọt",
//               IOptionValues: [
//                 { id: 1, value: "Ít", additionalPrice: 0 },
//                 { id: 2, value: "Bình thường", additionalPrice: 0 },
//                 { id: 3, value: "Ngọt", additionalPrice: 10000 },
//               ],
//             },
//           ]
//         : [
//             {
//               id: 1,
//               name: "Đá",
//               description: "Chọn lượng đá",
//               IOptionValues: [
//                 { id: 1, value: "Nhiều đá", additionalPrice: 0 },
//                 { id: 2, value: "Ít đá", additionalPrice: 0 },
//                 { id: 3, value: "Không đá", additionalPrice: 0 },
//               ],
//             },
//           ];

//     const paginatedResponse: IPaginationData<IMenuItem> = {
//       currentPage: pageNum,
//       totalPages: 3,
//       totalElements: 15,
//       pageSize: 5,
//       content: Array.from({ length: 5 }, (_, index) => ({
//         id: pageNum * 5 + index + 1,
//         name: `${
//           categoryId
//             ? initialCategories.find((c) => c.id === categoryId)?.name
//             : "Món ăn"
//         } ${pageNum * 5 + index + 1}`,
//         description: `Mô tả cho ${
//           categoryId
//             ? initialCategories.find((c) => c.id === categoryId)?.name
//             : "món ăn"
//         } ${pageNum * 5 + index + 1}`,
//         imageUrl: `https://example.com/images/${categoryId || "dish"}-${
//           pageNum * 5 + index + 1
//         }.jpg`,
//         basePrice: 100000 + (pageNum * 5 + index) * 10000,
//         options: sampleOptions,
//       })),
//     };

//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     setLoading(false);
//     return paginatedResponse;
//   };

//   useEffect(() => {
//     if (selectedCategory) {
//       fetchMenuItems(page, selectedCategory.id).then((response) => {
//         setMenuItems((prev) =>
//           page === 1 ? response.content : [...prev, ...response.content]
//         );
//         setTotalPages(response.totalPages);
//       });
//     }
//   }, [page, selectedCategory]);

//   const handleLoadMore = () => {
//     if (!loading && page < totalPages && !refreshing) {
//       setPage((prev) => prev + 1);
//     }
//   };

//   const onRefresh = () => {
//     setRefreshing(true);
//     setMenuItems([]);
//     setPage(1);
//     if (selectedCategory) {
//       fetchMenuItems(1, selectedCategory.id).then((response) => {
//         setMenuItems(response.content);
//         setTotalPages(response.totalPages);
//         setRefreshing(false);
//       });
//     } else {
//       setRefreshing(false);
//     }
//   };

//   const handleCategoryPress = (category: IMenuCategory) => {
//     setSelectedCategory(category);
//     setMenuItems([]);
//     setPage(1);
//   };

//   const handleAddToCart = (item: IMenuItem) => {
//     setSelectedItem(item);
//     setSelectedOptions({});
//     setQuantity(1);
//     setModalVisible(true);
//   };

//   const handleOptionSelect = (optionId: number, value: IOptionValue) => {
//     setSelectedOptions((prev) => ({ ...prev, [optionId]: value }));
//   };

//   const calculateTotalPrice = () => {
//     if (!selectedItem) return 0;
//     const optionsPrice = Object.values(selectedOptions).reduce(
//       (sum, option) => sum + option.additionalPrice,
//       0
//     );
//     return (selectedItem.basePrice + optionsPrice) * quantity;
//   };

//   const handleConfirmAdd = () => {
//     if (selectedItem) {
//       // Validate that all options have a selection
//       const missingSelection = selectedItem.options.some(
//         (option) => !selectedOptions[option.id]
//       );
//       if (missingSelection) {
//         setToastMessage("Vui lòng chọn tất cả các tùy chọn bắt buộc.");
//         setToastType("error");
//         setToastVisible(true);
//         return;
//       }
//       // Handle adding to cart
//       console.log({
//         item: selectedItem,
//         selectedOptions: Object.values(selectedOptions),
//         quantity,
//         totalPrice: calculateTotalPrice(),
//       });
//       setToastMessage(`${selectedItem.name} đã được thêm vào giỏ hàng!`);
//       setToastType("success");
//       setToastVisible(true);
//       setModalVisible(false);
//     }
//   };

//   const handleToastHide = () => {
//     setToastVisible(false);
//     setToastMessage("");
//     setToastType("success");
//   };

//   return (
//     <ContainerComponent>
//       <FlatList
//         data={initialCategories}
//         renderItem={({ item }) => (
//           <View style={{ flex: 1, marginBottom: 24 }}>
//             <MenuCategoryComponent
//               category={item}
//               onPress={() => handleCategoryPress(item)}
//               isSelected={item.id === selectedCategory?.id}
//             />
//           </View>
//         )}
//         keyExtractor={(item) => item.id.toString()}
//         horizontal
//         showsHorizontalScrollIndicator={false}
//       />
//       <SpaceComponent size={16} />
//       <FlatList
//         data={menuItems}
//         renderItem={({ item }) => (
//           <View style={{ flex: 1, padding: 8, margin: 6 }}>
//             <MenuItemComponent
//               menuItem={item}
//               onPress={() => {}}
//               onAddToCart={() => handleAddToCart(item)}
//             />
//           </View>
//         )}
//         keyExtractor={(item) => item.id.toString()}
//         showsVerticalScrollIndicator={false}
//         numColumns={numColumns}
//         key={`grid-${numColumns}`}
//         onEndReached={handleLoadMore}
//         onEndReachedThreshold={0.5}
//         ListFooterComponent={
//           loading && !refreshing ? (
//             <ActivityIndicator size="large" color={Colors.primary} />
//           ) : null
//         }
//         ListEmptyComponent={
//           !loading && !refreshing ? (
//             <TextComponent style={{ textAlign: "center", padding: 20 }}>
//               Không có món ăn nào trong danh mục này.
//             </TextComponent>
//           ) : null
//         }
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={onRefresh}
//             tintColor={Colors.primary}
//           />
//         }
//       />
//       <ModalComponent
//         visible={modalVisible}
//         title={selectedItem?.name}
//         onClose={() => setModalVisible(false)}
//         style={styles.modalContent}
//         titleStyle={styles.modalTitle}
//       >
//         {selectedItem?.options.map((option) => (
//           <View key={option.id} style={styles.optionContainer}>
//             <TextComponent style={styles.optionName}>
//               {option.name} (Bắt buộc)
//             </TextComponent>
//             <TextComponent style={styles.optionDescription}>
//               {option.description}
//             </TextComponent>
//             {option.IOptionValues.map((value) => (
//               <TouchableOpacity
//                 key={value.id}
//                 style={[
//                   styles.optionButton,
//                   selectedOptions[option.id]?.id === value.id &&
//                     styles.selectedOption,
//                   {
//                     borderColor: isDarkMode
//                       ? Colors.borderDark
//                       : Colors.borderLight,
//                   },
//                 ]}
//                 activeOpacity={0.7}
//                 onPress={() => handleOptionSelect(option.id, value)}
//               >
//                 <View style={styles.optionContent}>
//                   <TextComponent
//                     style={[
//                       styles.optionText,
//                       {
//                         color: isDarkMode
//                           ? selectedOptions[option.id]?.id === value.id
//                             ? Colors.buttonTextPrimary
//                             : Colors.textDarkPrimary
//                           : selectedOptions[option.id]?.id === value.id
//                           ? Colors.buttonTextPrimary
//                           : Colors.textLightPrimary,
//                       },
//                     ]}
//                   >
//                     {value.value}{" "}
//                     {value.additionalPrice > 0
//                       ? `(+${value.additionalPrice.toLocaleString()} VNĐ)`
//                       : ""}
//                   </TextComponent>
//                   {selectedOptions[option.id]?.id === value.id && (
//                     <Ionicons
//                       name="checkmark-circle"
//                       size={20}
//                       color={Colors.buttonTextPrimary}
//                     />
//                   )}
//                 </View>
//               </TouchableOpacity>
//             ))}
//           </View>
//         ))}
//         <RowComponent
//           justifyContent="flex-start"
//           alignItems="center"
//           style={styles.quantityContainer}
//         >
//           <TextComponent style={styles.quantityLabel}>Số lượng:</TextComponent>
//           <TouchableOpacity
//             style={styles.quantityButton}
//             activeOpacity={0.7}
//             onPress={() => setQuantity((prev) => Math.max(1, prev - 1))}
//           >
//             <TextComponent style={styles.quantityButtonText}>-</TextComponent>
//           </TouchableOpacity>
//           <TextComponent style={styles.quantityText}>{quantity}</TextComponent>
//           <TouchableOpacity
//             style={styles.quantityButton}
//             activeOpacity={0.7}
//             onPress={() => setQuantity((prev) => prev + 1)}
//           >
//             <TextComponent style={styles.quantityButtonText}>+</TextComponent>
//           </TouchableOpacity>
//         </RowComponent>
//         <TextComponent style={styles.totalPrice}>
//           Tổng cộng: {calculateTotalPrice().toLocaleString()} VNĐ
//         </TextComponent>
//         <RowComponent
//           justifyContent="space-between"
//           style={styles.buttonContainer}
//         >
//           <ButtonComponent
//             title="Hủy"
//             onPress={() => setModalVisible(false)}
//             type="outline"
//             style={styles.cancelButton}
//           />
//           <ButtonComponent
//             title="Thêm vào giỏ"
//             onPress={handleConfirmAdd}
//             type="primary"
//             style={styles.addButton}
//           />
//         </RowComponent>
//       </ModalComponent>
//       <Modal
//         animationType="none"
//         transparent={true}
//         visible={toastVisible}
//         onRequestClose={handleToastHide}
//       >
//         <View style={styles.toastModalContainer}>
//           <ToastComponent
//             message={toastMessage}
//             type={toastType}
//             visible={toastVisible}
//             onHide={handleToastHide}
//             duration={3000}
//           />
//         </View>
//       </Modal>
//     </ContainerComponent>
//   );
// };

// const styles = StyleSheet.create({
//   modalContent: {
//     width: "90%",
//     maxHeight: "80%",
//     borderRadius: 16,
//     padding: 24,
//     backgroundColor: Colors.white,
//     shadowColor: Colors.black,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: "700",
//     marginBottom: 16,
//   },
//   optionContainer: {
//     backgroundColor: Colors.backgroundLight,
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: Colors.borderLight,
//   },
//   optionName: {
//     fontSize: 18,
//     fontWeight: "700",
//     marginBottom: 8,
//   },
//   optionDescription: {
//     fontSize: 14,
//     color: Colors.textLightSecondary,
//     marginBottom: 12,
//   },
//   optionButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 12,
//     borderWidth: 1,
//     borderRadius: 10,
//     marginBottom: 8,
//     backgroundColor: Colors.white,
//   },
//   selectedOption: {
//     backgroundColor: Colors.secondary, // Basil green for selected option
//     borderColor: Colors.secondary,
//   },
//   optionContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     flex: 1,
//   },
//   optionText: {
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   quantityContainer: {
//     marginVertical: 20,
//     gap: 8, // Space between elements
//   },
//   quantityLabel: {
//     fontSize: 18,
//     fontWeight: "700",
//   },
//   quantityButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: Colors.backgroundLight,
//     borderWidth: 1,
//     borderColor: Colors.borderLight,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   quantityButtonText: {
//     fontSize: 20,
//     fontWeight: "600",
//     color: Colors.textLightPrimary,
//   },
//   quantityText: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: Colors.accent, // Yellow cheese for emphasis
//   },
//   totalPrice: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: Colors.accent, // Yellow cheese for prominence
//     textAlign: "right",
//     marginBottom: 20,
//   },
//   buttonContainer: {
//     gap: 12, // Space between buttons
//   },
//   cancelButton: {
//     flex: 1,
//     backgroundColor: Colors.buttonCancel, // Pepperoni orange
//     borderColor: Colors.buttonCancel,
//   },
//   addButton: {
//     flex: 1,
//     backgroundColor: Colors.primary, // Red tomato
//     borderRadius: 12,
//   },
//   toastModalContainer: {
//     flex: 1,
//     justifyContent: "flex-start",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.2)", // Slight overlay for emphasis
//   },
// });

// export default MenuScreen;
