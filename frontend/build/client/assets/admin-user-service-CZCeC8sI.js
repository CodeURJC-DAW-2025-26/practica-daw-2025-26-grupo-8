//#region app/services/admin-user-service.ts
var adminUserService = {
	async getAllUsers() {
		const response = await fetch("/api/v1/users/");
		if (!response.ok) throw new Error("Failed to fetch users");
		return response.json();
	},
	async createUser(data, role) {
		const response = await fetch(`/api/v1/users/?role=${role}`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data)
		});
		if (!response.ok) throw new Error("Failed to create user");
		return response.json();
	},
	async deleteUser(id) {
		if (!(await fetch(`/api/v1/users/${id}`, { method: "DELETE" })).ok) throw new Error("Failed to delete user");
	},
	async changePassword(id, data) {
		if (!(await fetch(`/api/v1/users/${id}/password`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data)
		})).ok) throw new Error("Failed to change password");
	}
};
//#endregion
export { adminUserService as t };
