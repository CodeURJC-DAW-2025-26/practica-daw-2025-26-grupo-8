import { createContext, useContext, useState } from "react";
import { jsx } from "react/jsx-runtime";
//#region app/contexts/AuthModalContext.tsx
var AuthModalContext = createContext(void 0);
function AuthModalProvider({ children }) {
	const [showAuthModal, setShowAuthModal] = useState(false);
	const [authView, setAuthView] = useState("login");
	const openAuthModal = (view = "login") => {
		setAuthView(view);
		setShowAuthModal(true);
	};
	const closeAuthModal = () => {
		setShowAuthModal(false);
	};
	const switchAuthView = (view) => {
		setAuthView(view);
	};
	return /* @__PURE__ */ jsx(AuthModalContext.Provider, {
		value: {
			showAuthModal,
			authView,
			openAuthModal,
			closeAuthModal,
			switchAuthView
		},
		children
	});
}
function useAuthModal() {
	const context = useContext(AuthModalContext);
	if (!context) throw new Error("useAuthModal debe usarse dentro de AuthModalProvider");
	return context;
}
//#endregion
export { useAuthModal as n, AuthModalProvider as t };
