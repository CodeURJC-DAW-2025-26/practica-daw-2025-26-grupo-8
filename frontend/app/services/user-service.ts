// frontend/app/services/user-service.ts
import type { UserDTO, UserUpdateDTO } from "../dtos/UserDTO";

export const userService = {
    /**
     * Envía los datos actualizados del perfil al backend.
     * Según el Tema 3, usamos fetch nativo.
     */
    async updateProfile(data: UserUpdateDTO): Promise<UserDTO> {
        const response = await fetch(`/api/v1/users/me`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) throw new Error("Error al actualizar el perfil");
        return response.json();
    }
};