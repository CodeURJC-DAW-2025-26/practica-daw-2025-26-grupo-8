import { create } from "zustand";
import { persist } from "zustand/middleware";

// Represents one cart line item.
export interface CartItem {
    productId: number;
    title: string;
    price: number;
    quantity: number;
    hasImage: boolean;
}

// Defines the cart store state and exposed actions.
interface CartState {
    items: CartItem[];
    addToCart: (product: CartItem) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    getTotalPrice: () => number;
    getTotalItems: () => number;
}

// Persistent cart store saved in local storage.
export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            // Adds a product or increases quantity if it already exists.
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

            // Removes one product line from the cart.
            removeFromCart: (productId: number) => {
                set({
                    items: get().items.filter(item => item.productId !== productId)
                });
            },

            // Updates quantity, or removes the item if quantity is zero or less.
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

            // Empties the whole cart.
            clearCart: () => {
                set({ items: [] });
            },

            // Computes the total cart price.
            getTotalPrice: () => {
                return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
            },

            // Computes the total quantity of items in the cart.
            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0);
            }
        }),
        {
            name: "cart-storage",
        }
    )
);
