//#region app/services/product-service.ts
var BASE_URL = "/api/v1/products";
var productService = {
	/**
	* Obtiene productos paginados.
	* @param page Número de página (empieza en 0)
	* @param size Cantidad de elementos por página (fijado a 4)
	*/
	async getProducts(page = 0, size = 4, categoryId) {
		let url = categoryId ? `/api/v1/categories/${categoryId}/products?page=${page}&size=${size}` : `/api/v1/products/?page=${page}&size=${size}`;
		const response = await fetch(url);
		if (!response.ok) throw new Error("Error al cargar productos");
		const data = await response.json();
		const content = Array.isArray(data.content) ? data.content : [];
		return {
			content,
			last: typeof data.last === "boolean" ? data.last : content.length < size
		};
	},
	async getAllProductsAdmin() {
		const response = await fetch(`/api/v1/products/?page=0&size=1000`);
		if (!response.ok) throw new Error("Error al cargar productos");
		const data = await response.json();
		return Array.isArray(data.content) ? data.content : [];
	},
	async getProductById(id) {
		const response = await fetch(`${BASE_URL}/${id}`);
		if (!response.ok) throw new Error("Producto no encontrado");
		return response.json();
	},
	async createProduct(product, imageFile) {
		const response = await fetch(`${BASE_URL}/`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(product)
		});
		if (!response.ok) throw new Error("Error al crear producto");
		const createdProduct = await response.json();
		if (imageFile) await this.uploadImage(createdProduct.id, imageFile);
		return createdProduct;
	},
	async updateProduct(id, product, imageFile) {
		const response = await fetch(`${BASE_URL}/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(product)
		});
		if (!response.ok) throw new Error("Error al actualizar producto");
		const updatedProduct = await response.json();
		if (imageFile) await this.uploadImage(updatedProduct.id, imageFile);
		return updatedProduct;
	},
	async deleteProduct(id) {
		if (!(await fetch(`${BASE_URL}/${id}`, { method: "DELETE" })).ok) throw new Error("Error al eliminar producto");
	},
	async uploadImage(productId, imageFile) {
		const formData = new FormData();
		formData.append("imageFile", imageFile);
		if (!(await fetch(`${BASE_URL}/${productId}/images`, {
			method: "POST",
			body: formData
		})).ok) throw new Error("Error al subir imagen");
	}
};
//#endregion
export { productService as t };
