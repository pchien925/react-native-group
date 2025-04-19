// Interfaces
interface ICartItem {
  id: number;
  quantity: number;
  priceAtAddition: number;
  menuItem: IMenuItem;
  options: IOptionValue[];
}

interface ICart {
  id: number;
  cartItems: ICartItem[];
  totalPrice: number;
}

// Sample option values from menuData.ts
const sizeSmall: IOptionValue = {
  id: 1,
  value: "Nhỏ",
  additionalPrice: 0,
};

const sizeMedium: IOptionValue = {
  id: 2,
  value: "Vừa",
  additionalPrice: 20000,
};

const sizeLarge: IOptionValue = {
  id: 3,
  value: "Lớn",
  additionalPrice: 40000,
};

const extraCheese: IOptionValue = {
  id: 4,
  value: "Phô mai",
  additionalPrice: 15000,
};

const extraBacon: IOptionValue = {
  id: 5,
  value: "Thịt xông khói",
  additionalPrice: 25000,
};

const noTopping: IOptionValue = {
  id: 6,
  value: "Không",
  additionalPrice: 0,
};

// Sample cart items
const cartItem1: ICartItem = {
  id: 1,
  quantity: 2,
  priceAtAddition: 190000, // basePrice (150000) + sizeLarge (40000)
  menuItem: {
    id: 1,
    name: "Pizza Margherita",
    description: "Pizza với sốt cà chua, phô mai mozzarella và lá húng quế",
    imageUrl:
      "https://cookingitalians.com/wp-content/uploads/2024/11/Margherita-Pizza.jpg",
    basePrice: 150000,
  },
  options: [sizeLarge],
};

const cartItem2: ICartItem = {
  id: 2,
  quantity: 1,
  priceAtAddition: 135000, // basePrice (120000) + extraCheese (15000)
  menuItem: {
    id: 4,
    name: "Mì Ý Carbonara",
    description: "Mì Ý với sốt kem, thịt xông khói và phô mai Parmesan",
    imageUrl:
      "https://img-global.cpcdn.com/recipes/cfa5ea1331a1b04e/680x482cq70/mi-y-cua-4ps-recipe-main-photo.jpg",
    basePrice: 120000,
  },
  options: [extraCheese],
};

const cartItem3: ICartItem = {
  id: 3,
  quantity: 1,
  priceAtAddition: 205000, // basePrice (180000) + extraBacon (25000)
  menuItem: {
    id: 2,
    name: "Pizza Pepperoni",
    description: "Pizza với xúc xích pepperoni và phô mai mozzarella",
    imageUrl:
      "https://cookingitalians.com/wp-content/uploads/2024/11/Margherita-Pizza.jpg",
    basePrice: 180000,
  },
  options: [extraBacon],
};

const cartItem4: ICartItem = {
  id: 4,
  quantity: 2,
  priceAtAddition: 200000, // basePrice (200000) + sizeSmall (0)
  menuItem: {
    id: 3,
    name: "Pizza Hải Sản",
    description: "Pizza với tôm, mực và phô mai mozzarella",
    imageUrl:
      "https://cookingitalians.com/wp-content/uploads/2024/11/Margherita-Pizza.jpg",
    basePrice: 200000,
  },
  options: [sizeSmall],
};

const cartItem5: ICartItem = {
  id: 5,
  quantity: 1,
  priceAtAddition: 130000, // basePrice (130000) + noTopping (0)
  menuItem: {
    id: 5,
    name: "Mì Ý Bolognese",
    description: "Mì Ý với sốt thịt bò bằm và cà chua",
    imageUrl:
      "https://img-global.cpcdn.com/recipes/cfa5ea1331a1b04e/680x482cq70/mi-y-cua-4ps-recipe-main-photo.jpg",
    basePrice: 130000,
  },
  options: [noTopping],
};

const cartItem6: ICartItem = {
  id: 6,
  quantity: 3,
  priceAtAddition: 90000, // basePrice (90000) + noTopping (0)
  menuItem: {
    id: 7,
    name: "Gà Rán Giòn",
    description: "Gà rán giòn rụm, ăn kèm sốt mayonnaise",
    imageUrl: "https://dulichmy.com.vn/wp-content/uploads/2021/12/ga-ran-7.jpg",
    basePrice: 90000,
  },
  options: [noTopping],
};

const cartItem7: ICartItem = {
  id: 7,
  quantity: 2,
  priceAtAddition: 110000, // basePrice (110000) + sizeSmall (0)
  menuItem: {
    id: 10,
    name: "Burger Bò Phô Mai",
    description: "Burger với thịt bò, phô mai cheddar và rau tươi",
    imageUrl: "https://example.com/images/beef-burger.jpg",
    basePrice: 110000,
  },
  options: [sizeSmall],
};

const cartItem8: ICartItem = {
  id: 8,
  quantity: 1,
  priceAtAddition: 80000, // basePrice (80000) + noTopping (0)
  menuItem: {
    id: 13,
    name: "Salad Caesar",
    description: "Salad với rau diếp, bánh mì nướng và sốt Caesar",
    imageUrl: "https://example.com/images/caesar-salad.jpg",
    basePrice: 80000,
  },
  options: [noTopping],
};

const cartItem9: ICartItem = {
  id: 9,
  quantity: 2,
  priceAtAddition: 45000, // basePrice (45000) + noTopping (0)
  menuItem: {
    id: 17,
    name: "Nước Cam Ép",
    description: "Nước cam tươi nguyên chất, giàu vitamin C",
    imageUrl: "https://example.com/images/orange-juice.jpg",
    basePrice: 45000,
  },
  options: [noTopping],
};

// Sample cart
export const sampleCart: ICart = {
  id: 1,
  cartItems: [
    cartItem1,
    cartItem2,
    cartItem3,
    cartItem4,
    cartItem5,
    cartItem6,
    cartItem7,
    cartItem8,
    cartItem9,
  ],
  totalPrice: 1260000, // (190000 * 2) + (135000 * 1) + (205000 * 1) + (200000 * 2) + (130000 * 1) + (90000 * 3) + (110000 * 2) + (80000 * 1) + (45000 * 2)
};
