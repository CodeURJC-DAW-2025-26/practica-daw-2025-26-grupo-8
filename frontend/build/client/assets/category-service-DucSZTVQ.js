//#region app/services/category-service.ts
var BASE_URL = "/api/v1/categories";
var categoryService = {
	/**
	* Obtiene todas las categorías de la pizzería.
	* Usamos fetch nativo según el Tema 3.
	*/
	async getCategories() {
		const response = await fetch(`${BASE_URL}/`);
		if (!response.ok) throw new Error("Error al obtener las categorías");
		return response.json();
	},
	async getCategoryById(id) {
		const response = await fetch(`${BASE_URL}/${id}`);
		if (!response.ok) throw new Error("Categoría no encontrada");
		return response.json();
	},
	async createCategory(category, imageFile) {
		const response = await fetch(`${BASE_URL}/`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(category)
		});
		if (!response.ok) throw new Error("Error al crear categoría");
		const createdCategory = await response.json();
		if (imageFile) await this.uploadImage(createdCategory.id, imageFile);
		return createdCategory;
	},
	async updateCategory(id, category, imageFile) {
		const response = await fetch(`${BASE_URL}/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(category)
		});
		if (!response.ok) throw new Error("Error al actualizar categoría");
		const updatedCategory = await response.json();
		if (imageFile) await this.uploadImage(updatedCategory.id, imageFile);
		return updatedCategory;
	},
	async deleteCategory(id) {
		if (!(await fetch(`${BASE_URL}/${id}`, { method: "DELETE" })).ok) throw new Error("Error al eliminar categoría");
	},
	async uploadImage(categoryId, imageFile) {
		const formData = new FormData();
		formData.append("imageFile", imageFile);
		if (!(await fetch(`${BASE_URL}/${categoryId}/images`, {
			method: "POST",
			body: formData
		})).ok) throw new Error("Error al subir imagen");
	}
};
//#endregion
export { categoryService as t };
