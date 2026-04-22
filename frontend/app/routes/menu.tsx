import { useState, useMemo } from "react";
import { Link, useLoaderData } from "react-router";
import { productService } from "../services/product-service";

export async function clientLoader() {
    const products = await productService.getProducts(0);
    return { products };
}

export default function Menu() {
    const { products } = useLoaderData<typeof clientLoader>();

    // Estado para multiselección (Exclusión)
    const [excludedAllergens, setExcludedAllergens] = useState<string[]>([]);

    // Normalización idéntica a tu alergensfilter.js
    const normalize = (val: string) => val.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

    // Lista de alérgenos de tu proyecto original
    const allergenOptions = [
        { id: "gluten", label: "Gluten" },
        { id: "lacteos", label: "Lácteos" },
        { id: "frutos secos", label: "Frutos Secos" },
        { id: "huevo", label: "Huevo" },
        { id: "pescado", label: "Pescado" }
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

    // LÓGICA DE FILTRADO (Exclusión pura como en tu original)
    const filteredProducts = useMemo(() => {
        if (excludedAllergens.length === 0) return products;
        return products.filter(p => {
            const pAllergies = (p.allergies || []).map(normalize);
            // "Si el producto tiene alguno de los alérgenos que quiero evitar, lo quito"
            return !excludedAllergens.some(ex => pAllergies.includes(ex));
        });
    }, [products, excludedAllergens]);

    return (
        <>
            <header className="bg-dark text-white py-5 text-center">
                <div className="container">
                    <h1 className="display-4 title-font">Nuestra Carta</h1>
                    <p className="lead text-secondary">Sabores tradicionales hechos al momento</p>
                </div>
            </header>

            <section className="section-padding container mt-5">
                {/* FILTROS: Estructura idéntica a menu.html */}
                <div className="d-flex justify-content-center flex-wrap gap-2 mb-4" id="allergenFilters">
                    <button
                        onClick={() => handleFilterClick('all')}
                        className={`btn btn-outline-secondary rounded-pill px-4 ${excludedAllergens.length === 0 ? 'active btn-primary text-white' : ''}`}
                    >
                        Todas
                    </button>
                    {allergenOptions.map(opt => (
                        <button
                            key={opt.id}
                            onClick={() => handleFilterClick(opt.id)}
                            className={`btn btn-outline-secondary rounded-pill px-4 ${excludedAllergens.includes(normalize(opt.id)) ? 'active btn-primary text-white border-primary' : ''}`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>

                {/* LISTA: Clases y Estructura de product-cards.html */}
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4" id="productsContainer">
                    {filteredProducts.map((p) => (
                        <div className="col product-item" key={p.id}>
                            <div className="card product-card h-100 border-0 shadow-sm">
                                <Link to={`/product/${p.id}`}>
                                    {/* AQUÍ LA CLAVE: Pedimos la imagen al endpoint del producto, no de la imagen */}
                                    <img
                                        src={p.hasImage ? `/api/v1/products/${p.id}/image` : "/assets/images/logo.png"}
                                        className="card-img-top"
                                        alt={p.title}
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                </Link>
                                <div className="card-body d-flex flex-column">
                                    <div className="mb-auto">
                                        <h3 className="card-title h5 title-font">{p.title}</h3>
                                        <p className="card-text text-muted small">{p.shortDescription}</p>
                                    </div>
                                    <div className="mt-3 d-flex justify-content-between align-items-center">
                                        <span className="price fw-bold text-success fs-5">{p.price}€</span>
                                        <button className="btn btn-sm btn-outline-primary rounded-pill">
                                            <i className="bi bi-plus-lg"></i> Añadir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}