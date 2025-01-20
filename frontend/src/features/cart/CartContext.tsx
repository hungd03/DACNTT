import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { CartItem } from "@/types/cart";
import { axiosInstance } from "@/lib/axiosInstance";

interface CartContextType {
  discount: number;
  setDiscount: (discount: number) => void;
  items: CartItem[];
  addItem: (productId: string, sku: string, quantity?: number) => Promise<void>;
  updateQuantity: (
    productId: string,
    sku: string,
    delta: number
  ) => Promise<void>;
  removeItem: (productId: string, sku: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "shopping_cart";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn } = useAuth();

  // Load initial cart data
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        if (isLoggedIn) {
          const { data } = await axiosInstance.post("/cart");
          // Fetch cart from API first
          if (data.success) {
            const serverItems = data.items || [];
            setItems(serverItems);

            // Merge with localStorage cart if exists
            const localCart = localStorage.getItem(CART_STORAGE_KEY);
            if (localCart) {
              const localItems = JSON.parse(localCart);

              // Filter out local items that already exist in server cart
              const itemsToAdd = localItems.filter((localItem: CartItem) => {
                return !serverItems.some(
                  (serverItem: CartItem) =>
                    serverItem.productId === localItem.productId &&
                    serverItem.sku === localItem.sku
                );
              });

              // Add only new items sequentially to avoid race conditions
              for (const item of itemsToAdd) {
                await addItem(item.productId, item.sku, item.quantity);
              }

              // Clear localStorage after successful merge
              localStorage.removeItem(CART_STORAGE_KEY);
            }
          }
        } else {
          // If not logged in, load from localStorage
          const localCart = localStorage.getItem(CART_STORAGE_KEY);
          if (localCart) {
            setItems(JSON.parse(localCart));
          }
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [isLoggedIn]);

  // Save to localStorage when cart changes (only for non-logged-in users)
  useEffect(() => {
    if (!isLoggedIn && items.length > 0) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isLoggedIn]);

  const addItem = async (
    productId: string,
    sku: string,
    quantity: number = 1
  ) => {
    setIsLoading(true);
    try {
      if (isLoggedIn) {
        const { data } = await axiosInstance.post("/cart/add", {
          productId,
          sku,
          quantity,
        });

        if (data.success) {
          const { data: cartData } = await axiosInstance.post("/cart");
          setItems(cartData.items);
        }
      } else {
        setItems((prevItems) => {
          const existingItem = prevItems.find(
            (item) => item.productId === productId && item.sku === sku
          );
          if (existingItem) {
            return prevItems.map((item) =>
              item.productId === productId && item.sku === sku
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }
          return [...prevItems, { productId, sku, quantity }];
        });
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (
    productId: string,
    sku: string,
    delta: number
  ) => {
    setIsLoading(true);
    try {
      if (isLoggedIn) {
        const { data } = await axiosInstance.patch("/cart", {
          productId,
          sku,
          delta,
        });

        if (data.success) {
          const { data: cartData } = await axiosInstance.post("/cart");
          setItems(cartData.items);
        }
      } else {
        setItems((prevItems) => {
          return prevItems
            .map((item) => {
              if (item.productId === productId && item.sku === sku) {
                const newQuantity = item.quantity + delta;
                return newQuantity > 0
                  ? { ...item, quantity: newQuantity }
                  : null;
              }
              return item;
            })
            .filter(Boolean) as CartItem[];
        });
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (productId: string, sku: string) => {
    setIsLoading(true);
    try {
      if (isLoggedIn) {
        const { data } = await axiosInstance.delete(
          `/cart/${productId}/${sku}`
        );
        if (data.success) {
          const { data: cartData } = await axiosInstance.post("/cart");
          setItems(cartData.items);
        }
      } else {
        setItems((prevItems) =>
          prevItems.filter(
            (item) => !(item.productId === productId && item.sku === sku)
          )
        );
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    setIsLoading(true);
    try {
      if (isLoggedIn) {
        const { data } = await axiosInstance.delete("/cart");
        if (data.success) {
          setItems([]);
        }
      } else {
        setItems([]);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        discount,
        setDiscount,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
