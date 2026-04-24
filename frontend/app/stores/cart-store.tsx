import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
    productId: number;
    title: string;
    price: number;
    quantity: number;
    hasImage: boolean;
}

interface CartState {
    items: CartItem[];
    addToCart: (product: CartItem) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addToCart: (product: CartItem) => {
                const existingItem = get().items.find(item => item.productId === product.productId);

                if (existingItem) {
                    set({
                        items: get().items.map(item =>
                            item.productId === product.productId
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        )
                    });
                } else {
                    set({
                        items: [...get().items, { ...product, quantity: 1 }]
                    });
                }
            },

            removeFromCart: (productId: number) => {
                set({
                    items: get().items.filter(item => item.productId !== productId)
                });
            },

            updateQuantity: (productId: number, quantity: number) => {
                if (quantity <= 0) {
                    get().removeFromCart(productId);
                } else {
                    set({
                        items: get().items.map(item =>
                            item.productId === productId
                                ? { ...item, quantity }
                                : item
                        )
                    });
                }
            },

            clearCart: () => {
                set({ items: [] });
            },

            getTotalPrice: () => {
                return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
            },

            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            }
        }),
        {
            name: "cart-storage",
        }
    )
);
