// src/data/categoryData.ts
export interface IMenuCategory {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
}

export const initialCategories: IMenuCategory[] = [
  {
    id: 1,
    name: "Pizza",
    description: "Pizza với nhiều loại nhân hấp dẫn",
    imageUrl: "https://example.com/images/pizza.jpg",
  },
  {
    id: 2,
    name: "Mì Ý",
    description: "Mì Ý thơm ngon với các loại sốt đặc trưng",
    imageUrl: "https://example.com/images/pasta.jpg",
  },
  {
    id: 3,
    name: "Gà Rán",
    description: "Gà rán giòn rụm, đậm đà hương vị",
    imageUrl: "https://example.com/images/fried-chicken.jpg",
  },
  {
    id: 4,
    name: "Burger",
    description: "Burger với nhân thịt bò, gà hoặc cá",
    imageUrl: "https://example.com/images/burger.jpg",
  },
  {
    id: 5,
    name: "Món Khai Vị",
    description: "Món khai vị nhẹ nhàng kích thích vị giác",
    imageUrl: "https://example.com/images/appetizers.jpg",
  },
  {
    id: 6,
    name: "Đồ Uống",
    description: "Đồ uống giải khát bổ sung cho bữa ăn",
    imageUrl: "https://example.com/images/beverages.jpg",
  },
];
