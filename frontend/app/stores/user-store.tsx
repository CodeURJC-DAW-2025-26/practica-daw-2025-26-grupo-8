import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserDTO } from "../dtos/UserDTO";

// Defines the data stored in the user state.
interface UserState {
    user: UserDTO | null;
    isLogged: boolean;
    isAdmin: boolean;
    setCurrentUser: (user: UserDTO) => void;
    removeCurrentUser: () => void;
}

// Zustand store for user authentication and role management, with persistence in localStorage.
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