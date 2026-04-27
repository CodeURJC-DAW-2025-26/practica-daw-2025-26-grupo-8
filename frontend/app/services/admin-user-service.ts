import { type UserDTO, type UserRegisterDTO, type UserUpdateDTO } from "../dtos/UserDTO";

// Service wrapper for admin user management API calls.
export const adminUserService = {
    // Gets all users for the admin panel.
    async getAllUsers(): Promise<UserDTO[]> {
        const response = await fetch('/api/v1/users/');
        if (!response.ok) throw new Error("Failed to fetch users");
        return response.json();
    },

    // Creates a new user with the selected role.
    async createUser(data: UserRegisterDTO, role: string): Promise<UserDTO> {
        const response = await fetch(`/api/v1/users/?role=${role}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Failed to create user");
        return response.json();
    },

    // Deletes a user by id.
    async deleteUser(id: number): Promise<void> {
        const response = await fetch(`/api/v1/users/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error("Failed to delete user");
    },

    // Updates the password of a specific user.
    async changePassword(id: number, data: UserUpdateDTO): Promise<void> {
        const response = await fetch(`/api/v1/users/${id}/password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Failed to change password");
    }
};
