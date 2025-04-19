import React, { createContext, useContext, useState } from "react";

interface IMenuItem {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  basePrice: number;
}

interface IOptionValue {
  id: number;
  value: string;
  additionalPrice: number;
}

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

interface CartContextType {
  cart: ICart;
  addToCart: (cartItem: ICartItem) => void;
  updateQuantity: (cartItemId: number, newQuantity: number) => void;
  removeFromCart: (cartItemId: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<ICart>({
    id: 1,
    cartItems: [],
    totalPrice: 0,
  });

  const addToCart = (cartItem: ICartItem) => {
    setCart((prev) => ({
      ...prev,
      cartItems: [...prev.cartItems, cartItem],
      totalPrice:
        prev.totalPrice + cartItem.priceAtAddition * cartItem.quantity,
    }));
  };

  const updateQuantity = (cartItemId: number, newQuantity: number) => {
    setCart((prev) => {
      const updatedItems = prev.cartItems.map((cartItem) =>
        cartItem.id === cartItemId
          ? {
              ...cartItem,
              quantity: Math.max(1, newQuantity),
            }
          : cartItem
      );
      const newTotalPrice = updatedItems.reduce(
        (sum, item) => sum + item.priceAtAddition * item.quantity,
        0
      );
      return {
        ...prev,
        cartItems: updatedItems,
        totalPrice: newTotalPrice,
      };
    });
  };

  const removeFromCart = (cartItemId: number) => {
    setCart((prev) => {
      const updatedItems = prev.cartItems.filter(
        (cartItem) => cartItem.id !== cartItemId
      );
      const newTotalPrice = updatedItems.reduce(
        (sum, item) => sum + item.priceAtAddition * item.quantity,
        0
      );
      return {
        ...prev,
        cartItems: updatedItems,
        totalPrice: newTotalPrice,
      };
    });
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, updateQuantity, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
