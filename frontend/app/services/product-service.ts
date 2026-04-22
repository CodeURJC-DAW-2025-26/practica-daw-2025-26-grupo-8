import type { ProductDTO } from "../dtos/ProductDTO";

const BASE_URL = '/api/v1/products';

export const productService = {
    /**
     * Obtiene productos paginados.
     * @param page Número de página (empieza en 0)
     * @param size Cantidad de elementos por página (fijado a 4)
     */
    async getProducts(page: number = 0, size: number = 4): Promise<{ content: ProductDTO[], last: boolean }> {
        // Añadimos explícitamente el parámetro size=4 a la URL
        const response = await fetch(`${BASE_URL}/?page=${page}&size=${size}`);

        if (!response.ok) {
            throw new Error("Error al cargar los productos");
        }

        const data = await response.json();
        const content: ProductDTO[] = data.content || [];

        // Soporta ambas serializaciones de Spring Page:
        // 1) shape clásico con `last`
        // 2) VIA_DTO con `page: { number, totalPages }`
        let isLast = false;

        if (typeof data.last === "boolean") {
            isLast = data.last;
        } else if (
            data.page &&
            typeof data.page.number === "number" &&
            typeof data.page.totalPages === "number"
        ) {
            isLast = data.page.totalPages === 0 || data.page.number >= data.page.totalPages - 1;
        } else if (
            typeof data.number === "number" &&
            typeof data.totalPages === "number"
        ) {
            isLast = data.totalPages === 0 || data.number >= data.totalPages - 1;
        } else {
            // Fallback: si la página trae menos elementos que `size`, asumimos que no hay más
            isLast = content.length < size;
        }

        return {
            content,
            last: isLast
        };
    },

    async getProductById(id: number): Promise<ProductDTO> {
        const response = await fetch(`${BASE_URL}/${id}`);
        if (!response.ok) throw new Error("Producto no encontrado");
        return response.json();
    }
};