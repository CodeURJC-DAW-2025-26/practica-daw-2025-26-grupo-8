import React, { createContext, useContext, useState } from "react";

type AuthView = "login" | "register";

interface AuthModalContextType {
    showAuthModal: boolean;
    authView: AuthView;
    openAuthModal: (view?: AuthView) => void;
    closeAuthModal: () => void;
    switchAuthView: (view: AuthView) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authView, setAuthView] = useState<AuthView>("login");

    const openAuthModal = (view: AuthView = "login") => {
        setAuthView(view);
        setShowAuthModal(true);
    };

    const closeAuthModal = () => {
        setShowAuthModal(false);
    };

    const switchAuthView = (view: AuthView) => {
        setAuthView(view);
    };

    return (
        <AuthModalContext.Provider value={{ showAuthModal, authView, openAuthModal, closeAuthModal, switchAuthView }}>
            {children}
        </AuthModalContext.Provider>
    );
}

export function useAuthModal() {
    const context = useContext(AuthModalContext);
    if (!context) {
        throw new Error("useAuthModal debe usarse dentro de AuthModalProvider");
    }
    return context;
}
