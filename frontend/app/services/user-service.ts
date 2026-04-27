import type { UserDTO, UserUpdateDTO } from "../dtos/UserDTO";

export const userService = {
    /**
    * Sends updated profile data to the backend.
    * Uses the native fetch API.
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