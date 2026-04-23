import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { categoryService } from "../../services/category-service";
import type { CategoryDTO } from "../../dtos/CategoryDTO";

export default function AdminCategoryEdit() {
    const { id } = useParams<{ id: string }>();
    
    const [category, setCategory] = useState<CategoryDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (!id) return;
        
        categoryService.getCategoryById(parseInt(id))
            .then(cat => {
                setCategory(cat);
                setTitle(cat.title);
                setDescription(cat.description);
                setLoading(false);
            })
            .catch(err => {
                setError("Error al cargar categoría: " + err.message);
                setLoading(false);
            });
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!id) return;
        
        setError("");
        setSuccess("");
        
        try {
            await categoryService.updateCategory(
                parseInt(id),
                { title, description },
                imageFile
            );
            
            // Reload the category to get updated image state
            const updated = await categoryService.getCategoryById(parseInt(id));
            setCategory(updated);
            setImageFile(null);
            
            // Reset file input
            const fileInput = document.getElementById('categoryImageInput') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            
            setSuccess("Cambios guardados con éxito.");
            
            // Optional: navigate back to categories after a delay
            // setTimeout(() => navigate("/admin/categories"), 2000);
        } catch (err: any) {
            setError("Error al actualizar categoría: " + err.message);
        }
    };

    if (loading) return <div className="text-center mt-5">Cargando...</div>;
    if (!category && !loading) return <div className="alert alert-danger mt-5">Categoría no encontrada.</div>;

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
                <h1 className="h2 title-font text-dark">Edit Category</h1>
                <Link to="/admin/categories" className="btn btn-outline-secondary">
                    <i className="bi bi-arrow-left"></i> Volver
                </Link>
            </div>

            <div className="card shadow-sm border-0 mx-auto mb-5" style={{ maxWidth: "800px" }}>
                <div className="card-header bg-dark text-white">
                    <h5 className="mb-0 fw-bold"><i className="bi bi-pencil-square me-2"></i> Editing: {category?.title}</h5>
                </div>
                <div className="card-body p-4">
                    <form onSubmit={handleSubmit} className="row g-3">
                        <div className="col-12">
                            <label className="form-label small text-muted">Category Name</label>
                            <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
                        </div>

                        <div className="col-12">
                            <label className="form-label small text-muted">New Background Image (Optional)</label>
                            {category?.hasImage && (
                                <div className="mb-2 d-flex align-items-center">
                                    <img src={`/api/v1/categories/${category.id}/image?timestamp=${Date.now()}`} className="rounded-3 shadow-sm border"
                                        style={{ width: "80px", height: "50px", objectFit: "cover" }} alt="Current" />
                                    <span className="ms-2 small text-muted">Uploading a new one replaces this.</span>
                                </div>
                            )}
                            <input type="file" id="categoryImageInput" className="form-control" accept="image/*"
                                onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} />
                        </div>

                        <div className="col-12">
                            <label className="form-label small text-muted">Description</label>
                            <textarea className="form-control" rows={3} value={description} onChange={e => setDescription(e.target.value)} required></textarea>
                        </div>

                        <div className="col-12 text-end mt-4">
                            <button type="submit" className="btn btn-primary btn-custom px-5">Save Category Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
