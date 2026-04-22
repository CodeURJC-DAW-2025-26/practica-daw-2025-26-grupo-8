import type { UserDTO, UserRegisterDTO } from "../dtos/UserDTO";
import type { OrderDTO } from "../dtos/OrderDTO";

const BASE_URL = '/api/v1';

export const authService = {
    // Hacer login
    async login(username: string, password: string) {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        if (!response.ok) throw new Error("Credenciales inválidas");
        return response.json();
    },

    // Obtener mi perfil (usando el token/cookie que ya tiene el navegador)
    async getMe(): Promise<UserDTO> {
        const response = await fetch(`${BASE_URL}/users/me`);
        if (!response.ok) throw new Error("No autenticado");
        return response.json();
    },

    // Obtener mis pedidos
    async getMyOrders(): Promise<OrderDTO[]> {
        const response = await fetch(`${BASE_URL}/users/me/orders`);
        if (!response.ok) throw new Error("No autenticado");
        return response.json();
    },

    // Cerrar sesión
    async logout() {
        const response = await fetch(`${BASE_URL}/auth/logout`, { method: 'POST' });
        if (!response.ok) throw new Error("Error al cerrar sesión");
    },

    // Registrar un usuario
    async register(userDto: UserRegisterDTO) {
        const response = await fetch(`${BASE_URL}/users/register`, {
            method: 'POST',
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