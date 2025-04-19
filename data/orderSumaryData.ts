const sizeLarge: IOrderOption = {
  id: 1,
  optionName: "Kích thước",
  optionValue: "Lớn",
  additionalPrice: 40000,
};

const sizeSmall: IOrderOption = {
  id: 2,
  optionName: "Kích thước",
  optionValue: "Nhỏ",
  additionalPrice: 0,
};

const extraCheese: IOrderOption = {
  id: 3,
  optionName: "Topping",
  optionValue: "Phô mai",
  additionalPrice: 15000,
};

const noTopping: IOrderOption = {
  id: 4,
  optionName: "Topping",
  optionValue: "Không",
  additionalPrice: 0,
};

// Sample order items
const orderItem1: IOrderItem = {
  id: 1,
  item: {
    id: 1,
    name: "Pizza Margherita",
    description: "Pizza với sốt cà chua, phô mai mozzarella và lá húng quế",
    imageUrl:
      "https://cookingitalians.com/wp-content/uploads/2024/11/Margherita-Pizza.jpg",
    basePrice: 150000,
  },
  quantity: 2,
  pricePerUnit: 190000, // basePrice (150000) + sizeLarge (40000)
  totalPrice: 380000, // 190000 * 2
  options: [sizeLarge],
};

const orderItem2: IOrderItem = {
  id: 2,
  item: {
    id: 4,
    name: "Mì Ý Carbonara",
    description: "Mì Ý với sốt kem, thịt xông khói và phô mai Parmesan",
    imageUrl: "https://example.com/images/carbonara.jpg",
    basePrice: 120000,
  },
  quantity: 1,
  pricePerUnit: 135000, // basePrice (120000) + extraCheese (15000)
  totalPrice: 135000, // 135000 * 1
  options: [extraCheese],
};

const orderItem3: IOrderItem = {
  id: 3,
  item: {
    id: 7,
    name: "Gà Rán Giòn",
    description: "Gà rán giòn rụm, ăn kèm sốt mayonnaise",
    imageUrl: "https://example.com/images/fried-chicken.jpg",
    basePrice: 90000,
  },
  quantity: 3,
  pricePerUnit: 90000, // basePrice (90000) + noTopping (0)
  totalPrice: 270000, // 90000 * 3
  options: [noTopping],
};

const orderItem4: IOrderItem = {
  id: 4,
  item: {
    id: 10,
    name: "Burger Bò Phô Mai",
    description: "Burger với thịt bò, phô mai cheddar và rau tươi",
    imageUrl: "https://example.com/images/beef-burger.jpg",
    basePrice: 110000,
  },
  quantity: 2,
  pricePerUnit: 110000, // basePrice (110000) + sizeSmall (0)
  totalPrice: 220000, // 110000 * 2
  options: [sizeSmall],
};

// Sample orders
export const sampleOrders: IOrderSummary[] = [
  {
    id: 1,
    userInfo: user1,
    orderCode: "ORD001",
    orderStatus: "Đang xử lý",
    totalPrice: 515000, // 380000 + 135000
    branchName: "Chi nhánh Quận 1",
    createdAt: "2025-04-18 14:30",
    updatedAt: "2025-04-18 14:35",
  },
  {
    id: 2,
    userInfo: user2,
    orderCode: "ORD002",
    orderStatus: "Đã giao",
    totalPrice: 490000, // 270000 + 220000
    branchName: "Chi nhánh Quận 7",
    createdAt: "2025-04-17 12:15",
    updatedAt: "2025-04-17 13:00",
  },
  {
    id: 3,
    userInfo: user1,
    orderCode: "ORD003",
    orderStatus: "Đã hủy",
    totalPrice: 135000, // 135000
    branchName: "Chi nhánh Quận 3",
    createdAt: "2025-04-16 09:00",
    updatedAt: "2025-04-16 09:30",
  },
];
