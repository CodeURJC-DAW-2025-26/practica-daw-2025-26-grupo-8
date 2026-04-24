import { create } from "zustand";
import { persist } from "zustand/middleware";
//#region app/stores/user-store.tsx
var useUserStore = create()(persist((set) => ({
	user: null,
	isLogged: false,
	isAdmin: false,
	setCurrentUser: (user) => {
		set({
			user,
			isLogged: true,
			isAdmin: user.roles.includes("ADMIN")
		});
	},
	removeCurrentUser: () => {
		set({
			user: null,
			isLogged: false,
			isAdmin: false
		});
	}
}), { name: "user-storage" }));
//#endregion
export { useUserStore as t };
