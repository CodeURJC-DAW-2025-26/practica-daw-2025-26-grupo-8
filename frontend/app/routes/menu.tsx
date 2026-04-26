import { useState, useMemo } from "react";
import { Link, useLoaderData } from "react-router";
import { productService } from "../services/product-service";
import type { ProductDTO } from "../dtos/ProductDTO";
import logoImage from "../assets/images/logo.png";
import { useCartStore } from "../stores/cart-store";
import { useUserStore } from "../stores/user-store";
import { useAuthModal } from "../contexts/AuthModalContext";


export async function clientLoader() {
    const data = await productService.getProducts(0, 4);
    return data;
}

export default function Menu() {
    const initialData = useLoaderData<typeof clientLoader>();
    const addToCart = useCartStore((state) => state.addToCart);
    const { isLogged } = useUserStore();
    const { openAuthModal } = useAuthModal();

    // ESTADOS PARA PAGINACIÓN (Necesarios para el botón "Cargar más")
    const [products, setProducts] = useState<ProductDTO[]>(initialData.content);
    const [page, setPage] = useState(0);
    const [isLast, setIsLast] = useState(initialData.last);
    const [isLoading, setIsLoading] = useState(false);
    const [addedProductId, setAddedProductId] = useState<number | null>(null);

    // ESTADO PARA FILTROS (Alérgenos)
    const [excludedAllergens, setExcludedAllergens] = useState<string[]>([]);

    const normalize = (val: string) =>
        val.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

    const allergenOptions = [
        { id: "gluten", label: "Sin gluten", icon: "bi-slash-circle" },
        { id: "lacteos", label: "Sin lácteos", icon: "bi-droplet" },
        { id: "huevo", label: "Sin huevo", icon: "bi-egg-fried" },
        { id: "pescado", label: "Sin pescado", icon: "bi-water" },
        { id: "frutos secos", label: "Sin frutos secos", icon: "bi-nut" },
        { id: "picante", label: "Sin picante", icon: "bi-fire" }
    ];

    const handleFilterClick = (id: string) => {
        if (id === 'all') {
            setExcludedAllergens([]);
            return;
        }
        const normId = normalize(id);
        setExcludedAllergens(prev =>
            prev.includes(normId) ? prev.filter(a => a !== normId) : [...prev, normId]
        );
    };

    // Lógica de filtrado sobre los productos cargados actualmente
    const filteredProducts = useMemo(() => {
        if (excludedAllergens.length === 0) return products;
        return products.filter(p => {
            const pAllergies = (p.allergies || []).map(normalize);
            return !excludedAllergens.some(ex => pAllergies.includes(ex));
        });
    }, [products, excludedAllergens]);

    // FUNCIÓN CARGAR MÁS: Pide los siguientes 4 productos
    const loadMoreProducts = async () => {
        setIsLoading(true);
        try {
            const nextPage = page + 1;
            const newData = await productService.getProducts(nextPage, 4);

            // Concatenamos los nuevos productos a los anteriores
            setProducts(prev => [...prev, ...newData.content]);
            setPage(nextPage);
            setIsLast(newData.last);
        } catch (error) {
            console.error("Error al cargar más:", error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleAddToCart = (product: ProductDTO) => {
        if (!isLogged) {
            openAuthModal("login");
            return;
        }
        addToCart({
            productId: product.id,
            title: product.title,
            price: product.price,
            quantity: 1,
            hasImage: product.hasImage,
        });

        setAddedProductId(product.id);
        setTimeout(() => setAddedProductId(null), 1500);
    };

    return (
        <>
            <header className="bg-dark text-white py-5 text-center">
                <div className="container">
                    <h1 className="display-4">Nuestra Carta</h1>
                    <p className="lead text-secondary">Sabores tradicionales hechos al momento</p>
                </div>
            </header>

            <section className="container mt-5 mb-5">
                {/* FILTROS */}
                <div className="d-flex justify-content-center flex-wrap gap-2 mb-4" id="allergenFilters">
                    <button
                        type="button"
                        onClick={() => handleFilterClick('all')}
                        className={`btn btn-allergen-filter ${excludedAllergens.length === 0 ? 'active' : ''}`}
                    >
                        <i className="bi bi-grid-3x3-gap"></i>
                        <span>Todos</span>
                    </button>
                    {allergenOptions.map(opt => (
                        <button
                            key={opt.id}
                            type="button"
                            onClick={() => handleFilterClick(opt.id)}
                            className={`btn btn-allergen-filter ${excludedAllergens.includes(normalize(opt.id)) ? 'active' : ''}`}
                        >
                            <i className={`bi ${opt.icon}`}></i>
                            <span>{opt.label}</span>
                        </button>
                    ))}
                </div>

                {/* GRID DE PRODUCTOS */}
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                    {filteredProducts.map((p) => (
                        <div className="col" key={p.id}>
                            <div className="card h-100 border-0 shadow-sm">
                                <Link to={`/product/${p.id}`}>
                                    <img
                                        src={p.hasImage ? `/api/v1/products/${p.id}/image` : logoImage}
                                        className="card-img-top"
                                        alt={p.title}
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                </Link>
                                <div className="card-body d-flex flex-column">
                                    <h3 className="h5">{p.title}</h3>
                                    <p className="text-muted small">{p.shortDescription}</p>
                                    <div className="mt-auto d-flex justify-content-between align-items-center">
                                        <span className="fw-bold text-success">{p.price}€</span>
                                        <button
                                            type="button"
                                            className={`btn btn-sm rounded-pill ${addedProductId === p.id ? "btn-success" : "btn-outline-primary"}`}
                                            onClick={() => handleAddToCart(p)}
                                        >
                                            {addedProductId === p.id ? "Añadido" : "Añadir"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CONTENEDOR DEL BOTÓN (Estética calcada del backend original) */}
                {!isLast && (
                    <div className="text-center mt-5">
                        <button
                            id="btnLoadMore"
                            className="btn btn-primary btn-custom btn-load-more rounded-pill mb-4 d-inline-flex align-items-center gap-2"
                            onClick={loadMoreProducts}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    <span>Cargando...</span>
                                </>
                            ) : (
                                <>
                                    <span>Más resultados</span>
                                    <i className="bi bi-arrow-down-circle-fill"></i>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </section>
        </>
    );
}