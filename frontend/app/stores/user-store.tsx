import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserDTO } from "../dtos/UserDTO";

// Definimos qué datos va a guardar nuestro almacén
interface UserState {
    user: UserDTO | null;
    isLogged: boolean;
    isAdmin: boolean;
    setCurrentUser: (user: UserDTO) => void;
    removeCurrentUser: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            isLogged: false,
            isAdmin: false,

            setCurrentUser: (user: UserDTO) => {
                const isAdmin = user.roles.includes("ADMIN");
                set({ user, isLogged: true, isAdmin });
            },

            removeCurrentUser: () => {
                set({ user: null, isLogged: false, isAdmin: false });
            },
        }),
        {
            name: "user-storage",
        }
    )
);