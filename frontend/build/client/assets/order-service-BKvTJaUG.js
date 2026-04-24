//#region app/services/order-service.ts
var BASE_URL = "/api/v1/orders";
var orderService = {
	async getAllOrders() {
		const response = await fetch(`${BASE_URL}/`);
		if (!response.ok) throw new Error("Error fetching orders");
		return response.json();
	},
	async getOrderById(id) {
		const response = await fetch(`${BASE_URL}/${id}`);
		if (!response.ok) throw new Error("Order not found");
		return response.json();
	},
	async createOrder(orderRequest) {
		const response = await fetch(`${BASE_URL}/`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(orderRequest)
		});
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.message || "Failed to create order");
		}
		return response.json();
	},
	async deleteOrder(id) {
		if (!(await fetch(`${BASE_URL}/${id}`, { method: "DELETE" })).ok) throw new Error("Failed to delete order");
	}
};
//#endregion
export { orderService as t };
