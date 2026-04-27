import { useEffect, useState } from "react";
import { Link } from "react-router";
import { categoryService } from "../../services/category-service";
import { productService } from "../../services/product-service";
import type { CategoryDTO } from "../../dtos/CategoryDTO";
import type { ProductDTO } from "../../dtos/ProductDTO";

export default function AdminCategories() {
    // Main data used by tables and forms.
    const [categories, setCategories] = useState<CategoryDTO[]>([]);
    const [products, setProducts] = useState<ProductDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [productFilter, setProductFilter] = useState("");

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [deleteType, setDeleteType] = useState<"category" | "product" | null>(null);
    const [itemToDelete, setItemToDelete] = useState<{ id: number, title: string } | null>(null);

    // Form state - Category
    const [categoryTitle, setCategoryTitle] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    const [categoryImage, setCategoryImage] = useState<File | null>(null);

    // Form state - Product
    const [productTitle, setProductTitle] = useState("");
    const [productCategoryId, setProductCategoryId] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productShortDesc, setProductShortDesc] = useState("");
    const [productDesc, setProductDesc] = useState("");
    const [productAllergies, setProductAllergies] = useState<string[]>([]);
    const [productImage, setProductImage] = useState<File | null>(null);
    const [showAllergens, setShowAllergens] = useState(false);

    // Loads categories and products together to keep the page in sync.
    const fetchAll = async () => {
        try {
            setLoading(true);
            const [cats, prods] = await Promise.all([
                categoryService.getCategories(),
                productService.getAllProductsAdmin()
            ]);
            setCategories(cats);
            setProducts(prods);
        } catch (err: any) {
            setErrorMessage("Error al cargar datos: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    // Creates a category, resets the form, and refreshes data.
    const handleCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        try {
            await categoryService.createCategory(
                { title: categoryTitle, description: categoryDescription },
                categoryImage!
            );
            setSuccessMessage("Categoría creada con éxito.");
            setCategoryTitle("");
            setCategoryDescription("");
            setCategoryImage(null);
            (e.target as HTMLFormElement).reset();
            fetchAll();
        } catch (err: any) {
            setErrorMessage("Error al crear categoría: " + err.message);
        }
    };

    // Creates a product, resets the form, and refreshes data.
    const handleProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        try {
            await productService.createProduct(
                {
                    title: productTitle,
                    categoryId: parseInt(productCategoryId),
                    price: parseFloat(productPrice),
                    shortDescription: productShortDesc,
                    description: productDesc,
                    allergies: productAllergies
                },
                productImage!
            );
            setSuccessMessage("Producto creado con éxito.");
            setProductTitle("");
            setProductCategoryId("");
            setProductPrice("");
            setProductShortDesc("");
            setProductDesc("");
            setProductAllergies([]);
            setProductImage(null);
            (e.target as HTMLFormElement).reset();
            fetchAll();
        } catch (err: any) {
            setErrorMessage("Error al crear producto: " + err.message);
        }
    };

    // Adds or removes one allergy from the current product selection.
    const toggleAllergy = (allergy: string) => {
        setProductAllergies(prev =>
            prev.includes(allergy)
                ? prev.filter(a => a !== allergy)
                : [...prev, allergy]
        );
    };

    // Opens the confirmation modal and stores the selected item.
    const confirmDelete = (type: "category" | "product", id: number, title: string) => {
        setDeleteType(type);
        setItemToDelete({ id, title });
        setShowModal(true);
    };

    // Deletes category/product after confirmation, then refreshes data.
    const handleDelete = async () => {
        if (!itemToDelete || !deleteType) return;
        setErrorMessage("");
        setSuccessMessage("");
        try {
            if (deleteType === "category") {
                await categoryService.deleteCategory(itemToDelete.id);
                setSuccessMessage("Categoría eliminada con éxito.");
            } else {
                await productService.deleteProduct(itemToDelete.id);
                setSuccessMessage("Producto eliminado con éxito.");
            }
            setShowModal(false);
            fetchAll();
        } catch (err: any) {
            setErrorMessage("Error al eliminar: " + err.message);
            setShowModal(false);
        }
    };

    // Client-side product search by title.
    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(productFilter.toLowerCase())
    );

    // Simple loading state while initial data is being fetched.
    if (loading) return <div className="text-center mt-5">Cargando...</div>;

    return (
        <>
            {successMessage && (
                <div className="alert alert-success alert-dismissible fade show mt-3 shadow-sm" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i> {successMessage}
                    <button type="button" className="btn-close" onClick={() => setSuccessMessage("")}></button>
                </div>
            )}

            {errorMessage && (
                <div className="alert alert-danger alert-dismissible fade show mt-3 shadow-sm" role="alert">
                    <i className="bi bi-x-circle-fill me-2"></i> {errorMessage}
                    <button type="button" className="btn-close" onClick={() => setErrorMessage("")}></button>
                </div>
            )}

            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-4 border-bottom">
                <h1 className="h2 title-font text-dark">Gestión de Inventario</h1>
            </div>

            <div className="row g-4 mb-5">
                {/* NEW CATEGORY FORM */}
                <div className="col-lg-5">
                    <div className="card shadow-sm h-100 border-0">
                        <div className="card-header bg-dark text-white">
                            <h5 className="mb-0 fw-bold"><i className="bi bi-folder-plus me-2"></i> Nueva Categoría</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleCategorySubmit}>
                                <div className="mb-3">
                                    <label className="form-label small text-muted">Nombre de la Categoría</label>
                                    <input type="text" className="form-control" placeholder="Ej: Entrantes"
                                        value={categoryTitle} onChange={e => setCategoryTitle(e.target.value)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small text-muted">Imagen de Fondo</label>
                                    <input type="file" className="form-control" accept="image/*"
                                        onChange={e => setCategoryImage(e.target.files ? e.target.files[0] : null)} required />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label small text-muted">Descripción Breve</label>
                                    <textarea className="form-control" rows={2}
                                        placeholder="Breve descripción de la categoría..."
                                        value={categoryDescription} onChange={e => setCategoryDescription(e.target.value)} required></textarea>
                                </div>

                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary btn-custom">Guardar Categoría</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-lg-7">
                    {/* NEW PRODUCT FORM */}
                    <div className="card shadow-sm h-100 border-0">
                        <div className="card-header bg-dark text-white">
                            <h5 className="mb-0 fw-bold"><i className="bi bi-pizza me-2"></i> Nuevo Producto</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleProductSubmit} className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label small text-muted">Nombre del Producto</label>
                                    <input type="text" className="form-control"
                                        placeholder="Ej: Pizza Hawaiana" value={productTitle} onChange={e => setProductTitle(e.target.value)} required />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label small text-muted">Categoría</label>
                                    <select className="form-select" value={productCategoryId} onChange={e => setProductCategoryId(e.target.value)} required>
                                        <option disabled value="">Selecciona...</option>
                                        {categories.map(c => (
                                            <option key={c.id} value={c.id}>{c.title}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-4">
                                    <label className="form-label small text-muted">Precio (€)</label>
                                    <input type="number" step="0.01" className="form-control"
                                        placeholder="0.00" value={productPrice} onChange={e => setProductPrice(e.target.value)} required />
                                </div>

                                <div className="col-md-8">
                                    <label className="form-label small text-muted">Alérgenos</label>
                                    <button
                                        className="btn btn-outline-secondary w-100 text-start d-flex justify-content-between align-items-center bg-white"
                                        type="button"
                                        onClick={() => setShowAllergens(!showAllergens)}>
                                        <span className="text-muted">Seleccionar alérgenos...</span>
                                        <i className={`bi bi-chevron-${showAllergens ? 'up' : 'down'}`}></i>
                                    </button>

                                    <div className={`collapse mt-2 ${showAllergens ? 'show' : ''}`} id="listaAlergenos">
                                        <div className="card card-body bg-light border-0 small">
                                            <div className="row g-2">
                                                {['Gluten', 'Lácteos', 'Huevo', 'Pescado', 'Frutos Secos', 'Picante'].map(alg => (
                                                    <div className="col-6 col-sm-4" key={alg}>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox"
                                                                checked={productAllergies.includes(alg)}
                                                                onChange={() => toggleAllergy(alg)}
                                                                id={`alg-${alg.toLowerCase().replace(' ', '')}`} />
                                                            <label className={`form-check-label ${alg === 'Picante' ? 'text-danger' : ''}`} htmlFor={`alg-${alg.toLowerCase().replace(' ', '')}`}>
                                                                {alg === 'Picante' && <i className="bi bi-fire me-1"></i>}
                                                                {alg === 'Gluten' && <i className="bi bi-slash-circle me-1"></i>}
                                                                {alg === 'Lácteos' && <i className="bi bi-droplet me-1"></i>}
                                                                {alg === 'Huevo' && <i className="bi bi-egg-fried me-1"></i>}
                                                                {alg === 'Pescado' && <i className="bi bi-water me-1"></i>}
                                                                {alg === 'Frutos Secos' && <i className="bi bi-nut me-1"></i>}
                                                                {alg !== 'Picante' && alg !== 'Gluten' && alg !== 'Lácteos' && alg !== 'Huevo' && alg !== 'Pescado' && alg !== 'Frutos Secos' && <i className="bi bi-tag me-1"></i>}
                                                                {alg === 'Frutos Secos' ? 'F. Secos' : alg}
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <label className="form-label small text-muted">Imagen</label>
                                    <input type="file" className="form-control" accept="image/*"
                                        onChange={e => setProductImage(e.target.files ? e.target.files[0] : null)} required />
                                </div>

                                <div className="col-12">
                                    <label className="form-label small text-muted">Descripción Breve</label>
                                    <input type="text" className="form-control"
                                        placeholder="Ej: Pizza clásica con pepperoni" value={productShortDesc} onChange={e => setProductShortDesc(e.target.value)} required />
                                </div>

                                <div className="col-12">
                                    <label className="form-label small text-muted">Descripción Detallada</label>
                                    <textarea className="form-control" rows={2}
                                        placeholder="Ingredientes, elaboración..." value={productDesc} onChange={e => setProductDesc(e.target.value)}></textarea>
                                </div>

                                <div className="col-12 text-end">
                                    <button type="submit" className="btn btn-primary btn-custom px-4">Guardar Producto</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* CATEGORY TABLE */}
            <div className="card shadow-sm mb-5 border-0">
                <div className="card-header bg-white py-3">
                    <h5 className="mb-0 fw-bold text-dark"><i className="bi bi-tags me-2"></i> Categorías Activas</h5>
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col" className="ps-4">Imagen</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Productos</th>
                                    <th scope="col" className="text-end pe-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(cat => (
                                    <tr key={cat.id}>
                                        <td className="ps-4">
                                            {cat.hasImage && (
                                                <img src={`/api/v1/categories/${cat.id}/image`} className="rounded-3 shadow-sm admin-table-img"
                                                    style={{ width: "45px", height: "45px", objectFit: "cover" }} alt={cat.title} />
                                            )}
                                        </td>
                                        <td className="fw-bold">{cat.title}</td>
                                        <td><span className="badge bg-secondary rounded-pill">ID: {cat.id}</span></td>
                                        <td className="text-end pe-4">
                                            <Link to={`/admin/categories/${cat.id}/edit`} className="btn btn-sm btn-outline-primary me-1" title="Editar">
                                                <i className="bi bi-pencil"></i>
                                            </Link>
                                            <button type="button" className="btn btn-sm btn-outline-danger" title="Borrar"
                                                onClick={() => confirmDelete("category", cat.id, cat.title)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {categories.length === 0 && (
                                    <tr><td colSpan={4} className="text-center py-4 text-muted">No hay categorías</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* PRODUCTS TABLE */}
            <div className="card shadow-sm mb-5 border-0">
                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold text-dark"><i className="bi bi-list-ul me-2"></i> Productos Activos</h5>
                    <input type="text" className="form-control form-control-sm w-25" placeholder="Filtrar productos..."
                        value={productFilter} onChange={e => setProductFilter(e.target.value)} />
                </div>
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th scope="col" className="ps-4">Img</th>
                                    <th scope="col">Nombre</th>
                                    <th scope="col">Categoría</th>
                                    <th scope="col">Precio</th>
                                    <th scope="col">Alérgenos</th>
                                    <th scope="col" className="text-end pe-4">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(prod => (
                                    <tr key={prod.id}>
                                        <td className="ps-4">
                                            {prod.hasImage ? (
                                                <img src={`/api/v1/products/${prod.id}/image`} className="rounded-circle admin-table-img"
                                                    style={{ width: "45px", height: "45px", objectFit: "cover" }} alt={prod.title} />
                                            ) : (
                                                <div className="rounded-circle admin-table-img bg-light p-1 d-flex align-items-center justify-content-center"
                                                    style={{ width: "45px", height: "45px" }}>
                                                    <i className="bi bi-image text-muted"></i>
                                                </div>
                                            )}
                                        </td>
                                        <td className="fw-bold">{prod.title}</td>
                                        <td>
                                            {prod.categoryTitle ? (
                                                <span className="badge bg-dark">{prod.categoryTitle}</span>
                                            ) : (
                                                <span className="badge border border-danger text-danger">Unassigned</span>
                                            )}
                                        </td>
                                        <td className="text-primary-custom fw-bold">{prod.price.toFixed(2)}€</td>
                                        <td>
                                            {prod.allergies && prod.allergies.length > 0 ? (
                                                prod.allergies.map((alg, i) => (
                                                    <span key={i} className="badge bg-secondary fw-normal me-1">{alg}</span>
                                                ))
                                            ) : (
                                                <small className="text-muted">-</small>
                                            )}
                                        </td>
                                        <td className="text-end pe-4">
                                            <Link to={`/admin/products/${prod.id}/edit`} className="btn btn-sm btn-outline-primary me-1" title="Editar">
                                                <i className="bi bi-pencil"></i>
                                            </Link>

                                            <button type="button" className="btn btn-sm btn-outline-danger" title="Borrar"
                                                onClick={() => confirmDelete("product", prod.id, prod.title)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredProducts.length === 0 && (
                                    <tr><td colSpan={6} className="text-center py-4 text-muted">No hay productos</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* CONFIRMATION MODAL*/}
            {showModal && (
                <>
                    <div className="modal-backdrop fade show"></div>
                    <div className="modal fade show d-block" tabIndex={-1}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content border-0 shadow-lg">
                                <div className="modal-header bg-danger text-white">
                                    <h5 className="modal-title">
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i> Confirmar Eliminación
                                    </h5>
                                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                                </div>
                                <div className="modal-body text-center py-4">
                                    <i className="bi bi-x-circle text-danger mb-3" style={{ fontSize: "3rem" }}></i>
                                    <p className="mb-0 fs-5 text-dark">
                                        ¿Seguro que quieres borrar {deleteType === 'category' ? 'la categoría' : 'el producto'} '{itemToDelete?.title}' permanentemente?
                                    </p>
                                    <p className="text-muted small mt-2">Esta acción no se puede deshacer.</p>
                                </div>
                                <div className="modal-footer bg-light justify-content-center">
                                    <button type="button" className="btn btn-outline-secondary px-4" onClick={() => setShowModal(false)}>Cancelar</button>
                                    <button type="button" className="btn btn-danger px-4" onClick={handleDelete}>Sí, borrar permanentemente</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}
