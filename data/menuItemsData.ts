// src/data/menuItemsData.ts
export interface IMenuItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  basePrice: number;
}

export const sampleMenuItems: IMenuItem[] = [
  // Pizza
  {
    id: 1,
    name: "Pizza Margherita",
    description: "Pizza với sốt cà chua, phô mai mozzarella và lá húng quế",
    imageUrl:
      "https://cookingitalians.com/wp-content/uploads/2024/11/Margherita-Pizza.jpg",
    basePrice: 150000,
  },
  {
    id: 2,
    name: "Pizza Pepperoni",
    description: "Pizza với xúc xích pepperoni và phô mai mozzarella",
    imageUrl:
      "https://cookingitalians.com/wp-content/uploads/2024/11/Margherita-Pizza.jpg",
    basePrice: 180000,
  },
  {
    id: 3,
    name: "Pizza Hải Sản",
    description: "Pizza với tôm, mực và phô mai mozzarella",
    imageUrl:
      "https://cookingitalians.com/wp-content/uploads/2024/11/Margherita-Pizza.jpg",
    basePrice: 200000,
  },
  // Mì Ý
  {
    id: 4,
    name: "Mì Ý Carbonara",
    description: "Mì Ý với sốt kem, thịt xông khói và phô mai Parmesan",
    imageUrl:
      "https://img-global.cpcdn.com/recipes/cfa5ea1331a1b04e/680x482cq70/mi-y-cua-4ps-recipe-main-photo.jpg",
    basePrice: 120000,
  },
  {
    id: 5,
    name: "Mì Ý Bolognese",
    description: "Mì Ý với sốt thịt bò bằm và cà chua",
    imageUrl:
      "https://img-global.cpcdn.com/recipes/cfa5ea1331a1b04e/680x482cq70/mi-y-cua-4ps-recipe-main-photo.jpg",
    basePrice: 130000,
  },
  {
    id: 6,
    name: "Mì Ý Hải Sản",
    description: "Mì Ý với tôm, mực và sốt cà chua",
    imageUrl:
      "https://img-global.cpcdn.com/recipes/cfa5ea1331a1b04e/680x482cq70/mi-y-cua-4ps-recipe-main-photo.jpg",
    basePrice: 150000,
  },
  // Gà Rán
  {
    id: 7,
    name: "Gà Rán Giòn",
    description: "Gà rán giòn rụm, ăn kèm sốt mayonnaise",
    imageUrl: "https://dulichmy.com.vn/wp-content/uploads/2021/12/ga-ran-7.jpg",
    basePrice: 90000,
  },
  {
    id: 8,
    name: "Cánh Gà Chiên Nước Mắm",
    description: "Cánh gà chiên giòn với sốt nước mắm đậm đà",
    imageUrl: "https://dulichmy.com.vn/wp-content/uploads/2021/12/ga-ran-7.jpg",
    basePrice: 85000,
  },
  {
    id: 9,
    name: "Đùi Gà Rán BBQ",
    description: "Đùi gà rán thấm vị BBQ, ăn kèm rau củ",
    imageUrl: "https://dulichmy.com.vn/wp-content/uploads/2021/12/ga-ran-7.jpg",
    basePrice: 100000,
  },
  // Burger
  {
    id: 10,
    name: "Burger Bò Phô Mai",
    description: "Burger với thịt bò, phô mai cheddar và rau tươi",
    imageUrl: "https://example.com/images/beef-burger.jpg",
    basePrice: 110000,
  },
  {
    id: 11,
    name: "Burger Gà Giòn",
    description: "Burger với gà rán giòn, rau diếp và sốt mayonnaise",
    imageUrl: "https://example.com/images/chicken-burger.jpg",
    basePrice: 95000,
  },
  {
    id: 12,
    name: "Burger Cá",
    description: "Burger với cá chiên giòn, rau tươi và sốt tartar",
    imageUrl: "https://example.com/images/fish-burger.jpg",
    basePrice: 100000,
  },
  // Món Khai Vị
  {
    id: 13,
    name: "Salad Caesar",
    description: "Salad với rau diếp, bánh mì nướng và sốt Caesar",
    imageUrl: "https://example.com/images/caesar-salad.jpg",
    basePrice: 80000,
  },
  {
    id: 14,
    name: "Súp Nấm",
    description: "Súp kem nấm thơm ngon, ăn kèm bánh mì",
    imageUrl: "https://example.com/images/mushroom-soup.jpg",
    basePrice: 60000,
  },
  {
    id: 15,
    name: "Khoai Tây Chiên",
    description: "Khoai tây chiên giòn, ăn kèm sốt mayonnaise",
    imageUrl: "https://example.com/images/fries.jpg",
    basePrice: 50000,
  },
  {
    id: 16,
    name: "Tôm Chiên Tempura",
    description: "Tôm chiên giòn kiểu Nhật, ăn kèm sốt tartar",
    imageUrl: "https://example.com/images/tempura.jpg",
    basePrice: 90000,
  },
  // Đồ Uống
  {
    id: 17,
    name: "Nước Cam Ép",
    description: "Nước cam tươi nguyên chất, giàu vitamin C",
    imageUrl: "https://example.com/images/orange-juice.jpg",
    basePrice: 45000,
  },
  {
    id: 18,
    name: "Trà Sữa Trân Châu",
    description: "Trà sữa thơm ngon với trân châu dai giòn",
    imageUrl: "https://example.com/images/bubble-tea.jpg",
    basePrice: 50000,
  },
  {
    id: 19,
    name: "Cà Phê Đen",
    description: "Cà phê đen đậm đà, không đường",
    imageUrl: "https://example.com/images/black-coffee.jpg",
    basePrice: 35000,
  },
  {
    id: 20,
    name: "Sinh Tố Dâu",
    description: "Sinh tố dâu tây tươi mát, ngọt tự nhiên",
    imageUrl: "https://example.com/images/strawberry-smoothie.jpg",
    basePrice: 55000,
  },
];
