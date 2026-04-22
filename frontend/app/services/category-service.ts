import type { CategoryDTO } from "../dtos/CategoryDTO.ts";

const BASE_URL = '/api/v1/categories';

export const categoryService = {
    /**
     * Obtiene todas las categorías de la pizzería.
     * Usamos fetch nativo según el Tema 3.
     */
    async getCategories(): Promise<CategoryDTO[]> {
        const response = await fetch(`${BASE_URL}/`);
        if (!response.ok) {
            throw new Error("Error al obtener las categorías");
        }
        return response.json();
    }
};