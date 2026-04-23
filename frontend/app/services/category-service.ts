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