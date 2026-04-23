import type { OrderDTO } from "../dtos/OrderDTO";

const BASE_URL = '/api/v1/orders';

export const orderService = {
    async getAllOrders(): Promise<OrderDTO[]> {
        const response = await fetch(`${BASE_URL}/`);
        if (!response.ok) throw new Error("Error fetching orders");
        return response.json();
    },

    async getOrderById(id: number): Promise<OrderDTO> {
        const response = await fetch(`${BASE_URL}/${id}`);
        if (!response.ok) throw new Error("Order not found");
        return response.json();
    },

    async deleteOrder(id: number): Promise<void> {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error("Failed to delete order");
    }
};