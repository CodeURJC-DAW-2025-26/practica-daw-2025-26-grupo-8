//#region app/services/auth-sevice.ts
var BASE_URL = "/api/v1";
var authService = {
	async login(username, password) {
		const response = await fetch(`${BASE_URL}/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				username,
				password
			})
		});
		if (!response.ok) throw new Error("Credenciales inválidas");
		return response.json();
	},
	async getMe() {
		const response = await fetch(`${BASE_URL}/users/me`);
		if (!response.ok) throw new Error("No autenticado");
		return response.json();
	},
	async getMyOrders() {
		const response = await fetch(`${BASE_URL}/users/me/orders`);
		if (!response.ok) throw new Error("No autenticado");
		return response.json();
	},
	async logout() {
		if (!(await fetch(`${BASE_URL}/auth/logout`, { method: "POST" })).ok) throw new Error("Error al cerrar sesión");
	},
	async register(userDto) {
		const response = await fetch(`${BASE_URL}/users/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(userDto)
		});
		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.error || "Error al registrarse");
		}
		return response.json();
	}
};
//#endregion
export { authService as t };
