import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { productService } from "../../services/product-service";
import { categoryService } from "../../services/category-service";
import type { ProductDTO } from "../../dtos/ProductDTO";
import type { CategoryDTO } from "../../dtos/CategoryDTO";

export default function AdminProductEdit() {
    const { id } = useParams<{ id: string }>();
    
    const [product, setProduct] = useState<ProductDTO | null>(null);
    const [categories, setCategories] = useState<CategoryDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [title, setTitle] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [price, setPrice] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [description, setDescription] = useState("");
    const [allergies, setAllergies] = useState<string[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (!id) return;
        
        Promise.all([
            productService.getProductById(parseInt(id)),
            categoryService.getCategories()
        ])
        .then(([prod, cats]) => {
            setProduct(prod);
            setCategories(cats);
            
            setTitle(prod.title);
            setCategoryId(prod.categoryId?.toString() || "");
            setPrice(prod.price.toString());
            setShortDescription(prod.shortDescription || "");
            setDescription(prod.description || "");
            setAllergies(prod.allergies || []);
            
            setLoading(false);
        })
        .catch(err => {
            setError("Error al cargar producto o categorías: " + err.message);
            setLoading(false);
        });
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        
        setError("");
        setSuccess("");
        
        try {
            await productService.updateProduct(
                parseInt(id),
                {
                    title,
                    categoryId: parseInt(categoryId),
                    price: parseFloat(price),
                    shortDescription,
                    description,
                    allergies
                },
                imageFile
            );
            
            // Reload the product to get updated image state
            const updated = await productService.getProductById(parseInt(id));
            setProduct(updated);
            setImageFile(null);
            
            // Reset file input
            const fileInput = document.getElementById('productImageInput') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            
            setSuccess("Cambios guardados con éxito.");
            
        } catch (err: any) {
            setError("Error al actualizar producto: " + err.message);
        }
    };

    const toggleAllergy = (allergy: string) => {
        setAllergies(prev =>
            prev.includes(allergy)
                ? prev.filter(a => a !== allergy)
                : [...prev, allergy]
        );
    };

    if (loading) return <div className="text-center mt-5">Cargando...</div>;
    if (!product && !loading) return <div className="alert alert-danger mt-5">Producto no encontrado.</div>;

    return (
        <>
            {success && (
                <div className="alert alert-success alert-dismissible fade show mt-3 shadow-sm" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i> {success}
                    <button type="button" className="btn-close" onClick={() => setSuccess("")}></button>
                </div>
            )}

            {error && (
                <div className="alert alert-danger alert-dismissible fade show mt-3 shadow-sm" role="alert">
                    <i className="bi bi-x-circle-fill me-2"></i> {error}
                    <button type="button" className="btn-close" onClick={() => setError("")}></button>
                </div>
            )}

            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom">
                <h1 className="h2 title-font text-dark">Edit Product</h1>
                <Link to="/admin/categories" className="btn btn-outline-secondary">
                    <i className="bi bi-arrow-left"></i> Volver
                </Link>
            </div>

            <div className="card shadow-sm border-0 mx-auto mb-5" style={{ maxWidth: "800px" }}>
                <div className="card-header bg-dark text-white">
                    <h5 className="mb-0 fw-bold"><i className="bi bi-pencil-square me-2"></i> Editing: {product?.title}</h5>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label small text-muted">Product Name</label>
                            <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small text-muted">Category</label>
                            <select className="form-select" value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
                                <option disabled value="">Select category...</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small text-muted">Price (€)</label>
                            <input type="number" step="0.01" className="form-control" value={price} onChange={e => setPrice(e.target.value)} required />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label small text-muted">New Image (Optional)</label>
                            {product?.hasImage ? (
                                <div className="mb-2 d-flex align-items-center">
                                    <img src={`/api/v1/products/${product.id}/image?timestamp=${Date.now()}`} className="rounded-3 shadow-sm border"
                                        style={{ width: "50px", height: "50px", objectFit: "cover" }} alt="Current" />
                                    <span className="ms-2 small text-muted">Uploading a new one replaces this.</span>
                                </div>
                            ) : (
                                <div className="mb-2 small text-danger">No image assigned.</div>
                            )}
                            <input type="file" id="productImageInput" className="form-control" accept="image/*"
                                onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} />
                        </div>

                        <div className="col-12 mt-3">
                            <label className="form-label small text-muted">Allergens</label>
                            <div className="card card-body bg-light border-0 small">
                                <div className="row g-2">
                                    {['Gluten', 'Lácteos', 'Huevo', 'Pescado', 'Frutos Secos', 'Picante'].map(alg => (
                                        <div className="col-4 col-md-2" key={alg}>
                                            <div className="form-check">
                                                <input className="form-check-input allergen-cb" type="checkbox"
                                                    checked={allergies.includes(alg)}
                                                    onChange={() => toggleAllergy(alg)}
                                                    id={`edit-alg-${alg.toLowerCase().replace(' ', '')}`} />
                                                <label className={`form-check-label ${alg === 'Picante' ? 'text-danger' : ''}`} htmlFor={`edit-alg-${alg.toLowerCase().replace(' ', '')}`}>
                                                    {alg === 'Frutos Secos' ? 'F. Secos' : alg}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="col-12">
                            <label className="form-label small text-muted">Short Description</label>
                            <input type="text" className="form-control" value={shortDescription} onChange={e => setShortDescription(e.target.value)} required />
                        </div>

                        <div className="col-12">
                            <label className="form-label small text-muted">Detailed Description</label>
                            <textarea className="form-control" rows={3} value={description} onChange={e => setDescription(e.target.value)}></textarea>
                        </div>

                        <div className="col-12 text-end mt-4">
                            <button type="submit" className="btn btn-primary btn-custom px-5">Save Product Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
