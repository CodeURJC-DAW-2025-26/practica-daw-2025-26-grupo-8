import type { ProductDTO } from "../dtos/ProductDTO";

const BASE_URL = '/api/v1/products';

export const productService = {
    /**
     * Gets paginated products.
     * @param page Page index (starts at 0)
     * @param size Number of items per page (defaults to 4)
     */
    async getProducts(page: number = 0, size: number = 4, categoryId?: number): Promise<{ content: ProductDTO[], last: boolean }> {
        // If a category is provided, use the category products endpoint.
        let url = categoryId
            ? `/api/v1/categories/${categoryId}/products?page=${page}&size=${size}`
            : `/api/v1/products/?page=${page}&size=${size}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Error al cargar productos");

        const data = await response.json();
        const content = Array.isArray(data.content) ? data.content : [];

        // Compatibility: infer `last` if the backend does not return it.
        const last = typeof data.last === "boolean"
            ? data.last
            : content.length < size;

        return {
            content,
            last
        };
    },

    // Gets all products without pagination (admin use case).
    async getAllProductsAdmin(): Promise<ProductDTO[]> {
        const response = await fetch(`/api/v1/products/?page=0&size=1000`);
        if (!response.ok) throw new Error("Error al cargar productos");

        const data = await response.json();
        return Array.isArray(data.content) ? data.content : [];
    },

    async getProductById(id: number): Promise<ProductDTO> {
        const response = await fetch(`${BASE_URL}/${id}`);
        if (!response.ok) throw new Error("Producto no encontrado");
        return response.json();
    },

    // Creates a new product. If an image file is provided, it will be uploaded after the product is created.
    async createProduct(product: Partial<ProductDTO>, imageFile?: File): Promise<ProductDTO> {
        const response = await fetch(`${BASE_URL}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product)
        });

        if (!response.ok) {
            throw new Error("Error al crear producto");
        }

        // Create the product first, then upload image if provided.
        const createdProduct = await response.json();

        if (imageFile) {
            await this.uploadImage(createdProduct.id, imageFile);
        }

        return createdProduct;
    },

    // Updates a product by id. If an image file is provided, it will be uploaded after the product is updated.
    async updateProduct(id: number, product: Partial<ProductDTO>, imageFile?: File | null): Promise<ProductDTO> {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product)
        });

        if (!response.ok) {
            throw new Error("Error al actualizar producto");
        }

        // Update the product first, then upload image if provided.
        const updatedProduct = await response.json();

        if (imageFile) {
            await this.uploadImage(updatedProduct.id, imageFile);
        }

        return updatedProduct;
    },

    // Deletes a product by id.
    async deleteProduct(id: number): Promise<void> {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error("Error al eliminar producto");
        }
    },

    // Uploads an image for a specific product.
    async uploadImage(productId: number, imageFile: File): Promise<void> {
        const formData = new FormData();
        formData.append('imageFile', imageFile);

        const response = await fetch(`${BASE_URL}/${productId}/images`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error("Error al subir imagen");
        }
    }
};