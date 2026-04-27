import type { OrderDTO, OrderRequestDTO } from "../dtos/OrderDTO";

const BASE_URL = '/api/v1/orders';

// Service wrapper for order-related API requests.
export const orderService = {
    // Gets all orders (admin use case).
    async getAllOrders(): Promise<OrderDTO[]> {
        const response = await fetch(`${BASE_URL}/`);
        if (!response.ok) throw new Error("Error fetching orders");
        return response.json();
    },

    // Gets one order by id.
    async getOrderById(id: number): Promise<OrderDTO> {
        const response = await fetch(`${BASE_URL}/${id}`);
        if (!response.ok) throw new Error("Order not found");
        return response.json();
    },

    // Creates a new order for the current authenticated user.
    async createOrder(orderRequest: OrderRequestDTO): Promise<OrderDTO> {
        const response = await fetch(`${BASE_URL}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(orderRequest)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create order");
        }
        return response.json();
    },

    // Deletes an order by id.
    async deleteOrder(id: number): Promise<void> {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error("Failed to delete order");
    }
};