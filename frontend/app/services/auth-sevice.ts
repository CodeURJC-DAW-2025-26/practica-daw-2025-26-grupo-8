import type { UserDTO, UserRegisterDTO } from "../dtos/UserDTO";
import type { OrderDTO } from "../dtos/OrderDTO";

const BASE_URL = '/api/v1';

export const authService = {
    // Signs in with username and password.
    async login(username: string, password: string) {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        if (!response.ok) throw new Error("Credenciales inválidas");
        return response.json();
    },

    // Gets the current authenticated user profile.
    async getMe(): Promise<UserDTO> {
        const response = await fetch(`${BASE_URL}/users/me`, {
            credentials: 'include',
        });
        if (!response.ok) throw new Error("No autenticado");
        return response.json();
    },

    // Gets the current user's orders.
    async getMyOrders(): Promise<OrderDTO[]> {
        const response = await fetch(`${BASE_URL}/users/me/orders`, {
            credentials: 'include',
        });
        if (!response.ok) throw new Error("No autenticado");
        return response.json();
    },

    // Signs out the current user.
    async logout() {
        const response = await fetch(`${BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        if (!response.ok) throw new Error("Error al cerrar sesión");
    },

    // Registers a new user account.
    async register(userDto: UserRegisterDTO) {
        const response = await fetch(`${BASE_URL}/users/register`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userDto),
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || "Error al registrarse");
        }
        return response.json();
    }
};