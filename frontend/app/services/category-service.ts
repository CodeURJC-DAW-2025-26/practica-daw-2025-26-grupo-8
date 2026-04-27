import type { CategoryDTO } from "../dtos/CategoryDTO.ts";

const BASE_URL = '/api/v1/categories';

export const categoryService = {
    /**
    * Gets all categories from the API.
    * Uses the native fetch API.
     */
    async getCategories(): Promise<CategoryDTO[]> {
        const response = await fetch(`${BASE_URL}/`);
        if (!response.ok) {
            throw new Error("Error al obtener las categorías");
        }
        return response.json();
    },

    async getCategoryById(id: number): Promise<CategoryDTO> {
        const response = await fetch(`${BASE_URL}/${id}`);
        if (!response.ok) {
            throw new Error("Categoría no encontrada");
        }
        return response.json();
    },

    async createCategory(category: Partial<CategoryDTO>, imageFile?: File): Promise<CategoryDTO> {
        const response = await fetch(`${BASE_URL}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(category)
        });

        if (!response.ok) {
            throw new Error("Error al crear categoría");
        }

        // Create the category first, then upload the image if provided.
        const createdCategory = await response.json();

        if (imageFile) {
            await this.uploadImage(createdCategory.id, imageFile);
        }

        return createdCategory;
    },

    async updateCategory(id: number, category: Partial<CategoryDTO>, imageFile?: File | null): Promise<CategoryDTO> {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(category)
        });

        if (!response.ok) {
            throw new Error("Error al actualizar categoría");
        }

        // Update the category first, then upload the new image if provided.
        const updatedCategory = await response.json();

        if (imageFile) {
            await this.uploadImage(updatedCategory.id, imageFile);
        }

        return updatedCategory;
    },

    async deleteCategory(id: number): Promise<void> {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error("Error al eliminar categoría");
        }
    },

    async uploadImage(categoryId: number, imageFile: File): Promise<void> {
        const formData = new FormData();
        formData.append('imageFile', imageFile);

        const response = await fetch(`${BASE_URL}/${categoryId}/images`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error("Error al subir imagen");
        }
    }
};