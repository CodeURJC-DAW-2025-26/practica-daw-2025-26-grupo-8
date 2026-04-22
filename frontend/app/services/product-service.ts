import { ProductDTO } from "../dtos/ProductDTO";

const BASE_URL = '/api/v1/products';

export const productService = {
    // Obtener productos paginados
    async getProducts(page: number = 0): Promise<ProductDTO[]> {
        const response = await fetch(`${BASE_URL}/?page=${page}`);
        if (!response.ok) throw new Error("Error al cargar los productos");

        const data = await response.json();

        // TRUCO: Si Spring Boot devuelve un objeto paginado, el array está en "data.content".
        // Si por algún motivo devuelve el array directo, usamos "data".
        return data.content ? data.content : data;
    },

    // Obtener un producto por ID
    async getProductById(id: number): Promise<ProductDTO> {
        const response = await fetch(`${BASE_URL}/${id}`);
        if (!response.ok) throw new Error("Producto no encontrado");
        return response.json();
    }
};