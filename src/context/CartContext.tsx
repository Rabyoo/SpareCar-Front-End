// src/context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Product } from "@/lib/types";
import { toast } from "sonner";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    size?: string,
    color?: string
  ) => void;
  removeFromCart: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// دالة مساعدة لإنشاء مفتاح فريد لكل عنصر في السلة
const getCartItemKey = (productId: string, size?: string, color?: string) => {
  return `${productId}-${size || "no-size"}-${color || "no-color"}`;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  //* Add item to cart
  const addToCart = (
    product: Product,
    quantity: number = 1,
    size?: string,
    color?: string
  ) => {
    if (!product._id) {
      console.error("Product is missing _id", product);
      return;
    }

    setCartItems((prev) => {
      const itemKey = getCartItemKey(product._id, size, color);

      const existingItemIndex = prev.findIndex((item) => {
        return (
          item.product._id === product._id &&
          item.size === size &&
          item.color === color
        );
      });

      if (existingItemIndex !== -1) {
        toast.success("Cart updated");

        const updatedItems = [...prev];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };

        return updatedItems;
      }

      toast.success("Added to cart");

      return [...prev, { product, quantity, size, color }];
    });
  };


  //* Remove item from cart
  const removeFromCart = (productId: string, size?: string, color?: string) => {
    setCartItems((prev) => {
      const itemKey = getCartItemKey(productId, size, color);
      return prev.filter((item) => {
        const itemProductId = item.product._id || item.product.id;
        const existingItemKey = getCartItemKey(
          itemProductId,
          item.size,
          item.color
        );
        return existingItemKey !== itemKey;
      });
    });
    toast.success("Removed from cart");
  };

  const updateQuantity = (
    productId: string,
    quantity: number,
    size?: string,
    color?: string
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    setCartItems((prev) => {
      const itemKey = getCartItemKey(productId, size, color);
      return prev.map((item) => {
        const itemProductId = item.product._id || item.product.id;
        const existingItemKey = getCartItemKey(
          itemProductId,
          item.size,
          item.color
        );
        return existingItemKey === itemKey ? { ...item, quantity } : item;
      });
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + (item.product.price || 0) * item.quantity,
      0
    );
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
