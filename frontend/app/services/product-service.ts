import type { ProductDTO } from "../dtos/ProductDTO";

const BASE_URL = '/api/v1/products';

export const productService = {
    /**
     * Obtiene productos paginados.
     * @param page Número de página (empieza en 0)
     * @param size Cantidad de elementos por página (fijado a 4)
     */
    async getProducts(page: number = 0, size: number = 4, categoryId?: number): Promise<{ content: ProductDTO[], last: boolean }> {
        // Si se especifica una categoría, usa el endpoint de categorías
        let url = categoryId
            ? `/api/v1/categories/${categoryId}/products?page=${page}&size=${size}`
            : `/api/v1/products/?page=${page}&size=${size}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Error al cargar productos");

        const data = await response.json();
        const content = Array.isArray(data.content) ? data.content : [];

        // Compatibilidad: si el backend no devuelve `last`, lo inferimos por tamaño de página
        const last = typeof data.last === "boolean"
            ? data.last
            : content.length < size;

        return {
            content,
            last
        };
    },

    async getProductById(id: number): Promise<ProductDTO> {
        const response = await fetch(`${BASE_URL}/${id}`);
        if (!response.ok) throw new Error("Producto no encontrado");
        return response.json();
    }
};