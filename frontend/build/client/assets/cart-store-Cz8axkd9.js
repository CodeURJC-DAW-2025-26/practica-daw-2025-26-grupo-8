import { create } from "zustand";
import { persist } from "zustand/middleware";
//#region app/stores/cart-store.tsx
var useCartStore = create()(persist((set, get) => ({
	items: [],
	addToCart: (product) => {
		if (get().items.find((item) => item.productId === product.productId)) set({ items: get().items.map((item) => item.productId === product.productId ? {
			...item,
			quantity: item.quantity + 1
		} : item) });
		else set({ items: [...get().items, {
			...product,
			quantity: 1
		}] });
	},
	removeFromCart: (productId) => {
		set({ items: get().items.filter((item) => item.productId !== productId) });
	},
	updateQuantity: (productId, quantity) => {
		if (quantity <= 0) get().removeFromCart(productId);
		else set({ items: get().items.map((item) => item.productId === productId ? {
			...item,
			quantity
		} : item) });
	},
	clearCart: () => {
		set({ items: [] });
	},
	getTotalPrice: () => {
		return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
	},
	getTotalItems: () => {
		return get().items.reduce((total, item) => total + item.quantity, 0);
	}
}), { name: "cart-storage" }));
//#endregion
export { useCartStore as t };
